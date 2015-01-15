define(['jquery','smoothscroll'], function($,smoothScroll) {
  var $html = $('html'),
      $document = $(document),
      fallback;

  fallback = setTimeout(function(){
    $document.trigger('init-view');
  },2000);

  $('loader > box').on('webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend', function() {
    $document.trigger('init-view');
  });

  if (window.location.hash === '') {
    smoothScroll(false,'#');
  }

  $document.one('init-view', function (evt) {
    clearTimeout(fallback);
    $html.removeClass('loading').addClass('prep');
    $document.trigger('prep');
    $(window).trigger('resize');
    $(window).trigger('scroll');

    setTimeout(function(){
      $html.removeClass('prep').addClass('loaded');
      $document.trigger('loaded');
      $(window).trigger('resize');
      $(window).trigger('scroll');

      if (window.location.hash !== '') {
        smoothScroll(evt,window.location.hash);
      }
    },750);
  });
});