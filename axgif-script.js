jQuery(document).ready(function() {
  jQuery('.gif').click(function() {
      jQuery(this).addClass('active');
      if($(this).hasClass('axgif')) {
      } else {
        var gifimg = jQuery(this).find('img');
        gifimg.attr('src', gifimg.data('src'));
      }
  });
})
