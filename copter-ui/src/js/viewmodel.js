define(['jquery'], function($) {
  var viewmodel = {
    state: '',
    position: '',
    nav: [],
    init: function() {
      viewmodel.$body = $('body');
      viewmodel.$overlay = $('<overlay />');

      viewmodel.$body.append(viewmodel.$overlay);

      viewmodel.setState(viewmodel.state);
    },
    setState: function(state) {
      viewmodel.state = state;
      $('body').attr('data-viewmodel-state', viewmodel.state);
    },
    setPosition: function(position) {
      viewmodel.position = position.toLowerCase();
      $('body').attr('data-viewmodel-position', viewmodel.position);
    },
    sidebarVisible: function() {
      return viewmodel.state === 'sidebar-open';
    }
  };

  return viewmodel;
});
