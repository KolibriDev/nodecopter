var express = require('express'),
    app = express(),
    path = require('path'),
    server = require("http").createServer(app);
module.exports = function() {
    app.use(express.static(path.join(__dirname, 'copter-ui/dev')));

    // app.configure(function() {
    //     app.use(express.favicon());
    //     app.use(express.logger('dev'));
    //     app.use(app.router);
    // });

    // app.configure('development', function() {
    //     app.use(express.errorHandler());
    //     app.locals.pretty = true;
    // });

    app.get('/', function(req, res) {
        console.log('sdasdas')
    });
    server.listen(3000);

    return server;
}
