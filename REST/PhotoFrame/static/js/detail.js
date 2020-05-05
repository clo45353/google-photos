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
function viewDetail(title) {
  hideError();
  showLoadingDialog();
  $('#detail').empty();
  
  $.get({
    type: 'GET',
    url: '/getDetail',
    dataType: 'json',
    data: 'title=' + title,
    success: (data) => {
      console.log('Loaded details: ' + data.length);
      // Render each album from the backend in its own row, consisting of
      // title, cover image, number of items, link to Google Photos and a
      // button to add it to the photo frame.

      const materialDesignLiteTable = $('<tbody />').addClass('mdl-tbody');

      // The items rendered here are albums that are returned from the
      // Library API.
      $.each(data, (i, item) => {
        // Load the cover photo as a 100x100px thumbnail.
        // It is a base url, so the height and width parameter must be appened.
        //const thumbnailUrl = `${item.baseUrl}=w100-h100`;

        // Set up a Material Design Lite list.
        const materialDesignLiteList =
            $('<tr />').addClass('mdl-data-table tbody tr');

        // Create the primary content for this list item.
        const primaryContentRoot =
            $('<td />').addClass('mdl-data-table td:first-of-type');
        materialDesignLiteList.append(primaryContentRoot);

        // The title of the album as the primary title of this item.
        const primaryContentTitle = $('<div />').text(item.filename);
        primaryContentRoot.append(primaryContentTitle);

        // Secondary content consists of links with buttons.
        const secondaryContentRoot =
            $('<td />').addClass('mdl-data-table td');
        materialDesignLiteList.append(secondaryContentRoot);

        // The size of the file as the secondary title of this item.
        const ContentSize = $('<div />').text(item.width+' x '+item.height)
        .addClass('mdl-list__item-sub-title');
        secondaryContentRoot.append(ContentSize);

        // Third content consists of links with buttons.
        const thirdContentRoot =
            $('<td />').addClass('mdl-data-table td');
        materialDesignLiteList.append(thirdContentRoot);

        // The creationdate of the file as the secondary title of this item.
        const ContentDate = $('<div />').text(item.creationTime.match(/\d{4}-\d{2}-\d{2}/))
        .addClass('mdl-list__item-sub-title');
        thirdContentRoot.append(ContentDate);

        // Forth content consists of links with buttons.
        const forthContentRoot =
            $('<td />').addClass('mdl-list__item-forth-action');
        materialDesignLiteList.append(forthContentRoot);

        // The 'open in Google Photos' link.
        const linkToGooglePhotos = $('<a />')
            .addClass('open-file')
            .attr('data-id', item.id)
        forthContentRoot.append(linkToGooglePhotos);

        // The button for the 'open in Google Photos' link.
        const googlePhotosButton = $('<button />')
                                       .addClass('gp-button raised')
                                       .text('Open');
        linkToGooglePhotos.append(googlePhotosButton);

        // Add the list item to the list of items.
        materialDesignLiteTable.append(materialDesignLiteList);

     });

      // Add the list item to the list of items.
      $('#detail').append(materialDesignLiteTable);

      hideLoadingDialog();
      console.log('detail loaded.');
    },
    error: (data) => {
      hideLoadingDialog();
      handleError('Couldn\'t load detail', data);
    }
  });
}

function openFromGooglePhoto(id) {
  //showLoadingDialog();
  let url;

  // Make an ajax request to the backend to load from an album.
  $.get({
    type: 'GET',
    url: '/openFile',
    dataType: 'json',
    data: {fileId: id},
    success: (data) => {
      console.log('File imported:' + JSON.stringify(data));
      if (data.item) {
        // Photos were loaded from Google Photo.
        url = data.item.productUrl
      } else {
        // No photos were loaded. Display an error.
        handleError('Couldn\'t open item. unexpected data.');
      }
      //hideLoadingDialog();

      // open another tab
      window.open(url, '_blank');
    },
    error: (data) => {
      handleError('Couldn\'t open item', data);
    }
  });
}

$(document).ready(() => {
  function getUrlParameter(search_param){
    // get string of paramters
    var url_part = window.location.search.substring(1);
    // decode string
    var decoded_url_part = decodeURIComponent(url_part);
    // split on the basis of "&"
    var params = decoded_url_part.split('&');
    
    //iterate throw each param and find if it matches required component
    for(i = 0; i < params.length; i++){
      param = params[i].split('=');
      if(search_param == param[0]){
        return param[1];
      }
    }
    // console.log(splitted);
  }	
  var title_param = getUrlParameter("title");
  console.log(title_param);

  // Load the list of items from the backend when the page is ready.
  //console.log('detail.js ready. title=' + $('#title'));
  viewDetail(title_param);

  // Clicking the 'open' button starts an import request.
  $('#detail').on('click', '.open-file', (event) => {
    const target = $(event.currentTarget);
    const fileid = target.attr('data-id');

    console.log('Importing album: ' + fileid);

    openFromGooglePhoto(fileid);
  });

});
