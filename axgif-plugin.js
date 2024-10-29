var imgChoice;


(function() {

  tinymce.create('tinymce.plugins.axgifbuttons', {
    init : function(ed, url) {

      ed.addButton('gif', {
        title : 'AX Gif',
        cmd : 'axgif',
        image : url + '/gif.svg'
      });

      ed.addCommand('axgif', function() {

        var modalRender = `
        <div class="gif-modal-elements gif-modal-behind"></div>
        <div class="gif-modal-elements gif-modal-window">
        <div class="modal-top-bar">
        <h1>AX Gif by The Big Hack</h1>
        <button id="close-modal" aria-label="Close Window">
        <div class="close-icon"></div>
        Close Window
        </button>
        </div>
        <div class="gif-window-container">
        <a target="_blank" href="https://bighack.org"><img class="logo" src="` + url +`/LogoBeta.svg" alt="The Big Hack logo"></a>
        <form class="gif-search" action="">
        <input type="text" id="gif-search-input" required class="gif-search-input">
        <label for="gif-search-input">Search for gifs on Giphy</label>
        <button class="button-primary">Search</button>
        </form>
        <div id="gifresults">
        <div class="img-container"></div>
        </div>
        <img src="` + url + `/giphylogo.gif" alt="Powered by Giphy" id="giphylogo">
        </div>
        </div>
        `;

        $('body.wp-admin').append(modalRender);

        $('#close-modal').click(function() {
          $('.gif-modal-elements').remove();
        })

        $('.gif-search').submit(function(e) {
          $('#gifresults').html('<div class="img-container"></div>');
          e.preventDefault();
          searchGiphy();
        });

        $(document).on('click', '#load-more-gifs', function() {
          var imgCount = $('.img-container img').length;
          searchGiphy(imgCount);
        });

        $(document).on('click', '#insert-gif', function() {
          console.log('test7');
          var imgIndex = $('#gifresults .selected').data('index');
          var imgAlt = $('#optionalalt').val();
          console.log(imgChoice[imgIndex].images);
          var appendImg =
          '<div class="gif axgif" style="background-image: url(' + imgChoice[imgIndex].images.original_still.url + '); background-size: cover;"> \
          <div role="button" aria-label="Click to play GIF of ' + imgAlt + '" class="gif-overlay"><div class="group"><span class="play-text">Click or tap to play GIF</span><div class="play-button"></div></div></div> \
          <picture style="visibility:hidden;"> \
          <source srcset="' + imgChoice[imgIndex].images.original.webp + '" type="image/webp"> \
          <img src="' + imgChoice[imgIndex].images.original.url + '" alt="' + imgAlt + '"/> \
          </picture></div>';

          ed.execCommand('mceInsertContent', 0, appendImg);
          $('.gif-modal-elements').remove();
        });

      });

    },
  });
  // Register plugin
  tinymce.PluginManager.add( 'axgifbuttons', tinymce.plugins.axgifbuttons );
})();

function searchGiphy(offset = 0) {
			var searchTerm = $('.gif-search-input').val();
			var apiString = 'https://api.giphy.com/v1/gifs/search?api_key=NC3YXJbQgJvN7QdNRbwKgG9ax8Sg2uUM&q=' + searchTerm + '&limit=24&offset=' + offset + '&rating=G&lang=en';
			$.get(apiString, function(response) {
				var data = response.data;
				console.log(data);
				imgChoice = data;
				data.forEach(function(item, index) {
          $('#gifresults .img-container').append('<a aria-label="' + item.title + '" href="#"><img data-index="' + index + '" src="' + item.images.fixed_width_downsampled.url + '" alt="' + item.title + '"/></a>');
				})
				if(offset < 1) {
					$('#gifresults').append('<button class="button-primary" id="load-more-gifs">Load More</button>');

				}

			})

			$(document).on('click', '#gifresults a', function() {
				$('#gifresults a').hide();
				var insideImg = $(this).children('img');
				var giphyAlt = insideImg.attr('alt');
				$(this).show();
				insideImg.addClass('selected');
				$('.optional-alt, #load-more-gifs').remove();
				$('#gifresults').append(
					`<div class="optional-alt">
					<label for="optionalalt">Edit the alt text if you would like.</label>
					<input type="text" name="optionalalt" id="optionalalt" value="` + giphyAlt + `"/>
					<button class="button-primary" id="insert-gif">Insert into editor</button>
					</div>
					`
				)
			})

			$('#gifresults a').keypress(function(e){
        if(e.which == 13){//Enter key pressed
            $(this).click();//Trigger search button click event
        }
    });
		}
