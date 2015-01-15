define(['domReady','sticky'], function(domReady,sticky) {
  domReady(function(){
    sticky.init(['[sticky]']);
  });
});