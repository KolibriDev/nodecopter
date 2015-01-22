define(['jquery', 'socketio'], function($, io) {
    var socket = io.connect('http://localhost:3000', {
        // options here
    });

    return socket;
});
