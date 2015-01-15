define(['jquery','nav','history','smoothscroll','classList'], function($,nav,History,smoothscroll){
  if (!nav) {
    return false;
  }

  History.Adapter.bind(window, 'statechange', function() {
    navigate.run(History.getState().hash);
  });

  var navigate = {
    go: function(href) {
      if (href === navigate.cleanUrl()) {
        nav.close();
      }
      if (typeof href !== 'undefined' && href.substring(0,1) === '#') {
        smoothscroll(false,href);
      } else {
        History.pushState(null, null, navigate.cleanUrl(href));
      }
      if (typeof href !== 'undefined' && href.indexOf('#') > -1) {
        var hash = href.split('#');
        hash = hash[1];
        smoothscroll(false,'#'+hash);
        $(document).on('re-loaded',function(){
          smoothscroll(false,'#'+hash);
        });
      }
    },

    run: function(href) {
      try {

        nav.navigate(href);

        $.ajax({
          type: 'GET',
          url: href
        })
        .done(nav.success)
        .fail(nav.fail);

      } catch(exc) {
        console.error('exception',exc);
        nav.fail();
      }
      return;
    },

    cleanUrl: function(url) {
      if (!url) {
        return window.location.pathname;
      }
      if (url.indexOf('localhost') > -1 || url.indexOf('.is') > -1) {
        var divider = url.indexOf('localhost') > -1 ? ':1337' : '.is';
        url = url.split(divider);
        url = url[1];
      }
      if (url.indexOf('#') > -1) {
        url = url.split('#');
        url = url[0];
      }

      return url;
    },

  };

  return navigate;
});
