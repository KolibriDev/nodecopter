define(['jquery','domReady','highlight'], function($,domReady,highlight) {
  domReady(function(){
    $('pre code').each(function(i, block) {
      highlight.highlightBlock(block);
    });
  });
});