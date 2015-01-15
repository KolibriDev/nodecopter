define(['jquery','domReady'], function($,domReady) {
	var pathRoot = '/img/';

  domReady(function(){
  	var doMe = function() {
  		var i = 0;
  		while(i < 10) {
  			$('#right-output').append($('<img />').attr('src',pathRoot+'selfie'+i+'.jpg'));
  			i++;
  		}
  		setTimeout(doMe,3000);
  	};

  	doMe();


  });
});
