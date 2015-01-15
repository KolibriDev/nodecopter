var express = require('express'),
    routes = require('./routes'),
    app = express(),
    path = require('path'),
    server = require("http").createServer(app);

console.log(app)
app.configure(function () {
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

app.get('/', routes.index);

require('dronestatus').listen(server);
require("dronestream").listen(server);
server.listen(3000);
