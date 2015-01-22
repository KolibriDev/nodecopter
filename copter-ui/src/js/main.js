
(function() {
  require.config({
    baseUrl: '/js',
    paths: {
      async: 'vendor/async',
      depend: 'vendor/depend',
      font: 'vendor/font',
      goog: 'vendor/goog',
      image: 'vendor/image',
      json: 'vendor/json',
      mdown: 'vendor/mdown',
      noext: 'vendor/noext',
      propertyParser: 'vendor/propertyParser',
      mdConverter: 'vendor/Markdown.Converter',
      text: 'vendor/text',

      domReady: 'vendor/domReady',
      jquery: 'vendor/jquery.min',
      jqEasing: 'vendor/jquery.easing.min',
      classList: 'vendor/classList',
      underscore: 'vendor/underscore-min',
      highlight: 'vendor/highlight',

      rafPolyfill: 'kolibri/raf-polyfill',
      scrolltrigger: 'kolibri/koli-scrolltrigger',
      sticky: 'kolibri/koli-sticky',
      smoothscroll: 'kolibri/koli-smoothscroll',
      navigate: 'kolibri/koli-navigate',
      cssTranslate: 'kolibri/koli-css-translate',
      sidebar: 'kolibri/koli-sidebar',

      align: 'kolibri/koli-align',
      alignHelpers: 'kolibri/koli-align-helpers',
      alignEqualize: 'kolibri/koli-align-equalize',
      alignVerticalCenter: 'kolibri/koli-align-vertical-center',
      alignWindowHeight: 'kolibri/koli-align-window-height',

      viewmodel: 'viewmodel',
      socketio: 'http://localhost:3000/socket.io/socket.io.js',
      socket: 'init/socket',
    },
    shim: {
      jquery: { exports: '$' },
      jqEasing: { deps: ['jquery'] },
      underscore: { exports: '_' },
      history: { exports: 'History' },
      socketio: { exports: 'io' },
    }
  });

  require([
    'init/view',
    'init/viewmodel',
    'init/align',
    'init/dronestream',
    'init/dronestatus',
    'init/faces',
    'init/subtitles',
    'init/moving',
  ]);
}).call(this);
