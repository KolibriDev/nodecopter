var express = require('express'),
    app = express(),
    path = require('path'),
    server = require("http").createServer(app);
module.exports = function() {
    app.configure(function() {
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function() {
        app.use(express.errorHandler());
        app.locals.pretty = true;
    });

    app.get('/', function(req, res) {
        res.redirect('http://localhost:1337');
    });
    server.listen(3000,function () {
    	console.log('asdfasd');
    });
    return server;
}







