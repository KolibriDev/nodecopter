define(['jquery','domReady','smoothscroll','sidebar'], function($,domReady,smoothscroll,sidebar) {
  domReady(function(){
    $('pagewrap a[href^="#"]').on('click.smoothscroll', function(evt,elem){
      smoothscroll(evt,$(this).attr('href'));
      sidebar.close();
    });
  });
});
