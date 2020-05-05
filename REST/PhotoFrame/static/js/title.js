// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Loads a list of all albums owned by the logged in user from the backend.
// The backend returns a list of albums from the Library API that is rendered
// here in a list with a cover image, title and a link to open it in Google
// Photos.
function getTitles() {
  hideError();
  showLoadingDialog();
  $('#titles').empty();
  
  $.get({
    type: 'GET',
    url: '/getTitles',
    dataType: 'json',
    success: (data) => {
      console.log('Loaded titles: ' + data.index);
      // Render each album from the backend in its own row, consisting of
      // title, cover image, number of items, link to Google Photos and a
      // button to add it to the photo frame.
      // The items rendered here are albums that are returned from the
      // Library API.
      $.each(data.index, (i, item) => {
        // Load the cover photo as a 100x100px thumbnail.
        // It is a base url, so the height and width parameter must be appened.
        //const thumbnailUrl = `${item.baseUrl}=w100-h100`;

        if('title' in item){

          // Set up a Material Design Lite list.
          const materialDesignLiteList =
              $('<li />').addClass('mdl-list__item');

          // Create the primary content for this list item.
          const primaryContentRoot =
              $('<div />').addClass('mdl-list__item-primary-content');
          materialDesignLiteList.append(primaryContentRoot);

          const linkToDetailPage =
              $('<a />').attr('href', '/detail?title='+item.title);
          primaryContentRoot.append(linkToDetailPage);

          // The title of the album as the primary title of this item.
          const primaryContentTitle = $('<div />').text(item.title);
          linkToDetailPage.append(primaryContentTitle);

          // Add the list item to the list of items.
          $('#titles').append(materialDesignLiteList);
        }
      });

      hideLoadingDialog();
      console.log('titles loaded.');
    },
    error: (data) => {
      hideLoadingDialog();
      handleError('Couldn\'t load titles', data);
    }
  });
}

$(document).ready(() => {
  // Load the list of items from the backend when the page is ready.
  getTitles();
});
