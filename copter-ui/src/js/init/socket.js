define(['jquery', 'socketio', 'underscore'], function($, io, _) {
    var socket = io.connect('http://localhost:3000', {
        // options here
    });
    console.log(socket.on);
    var canvas = document.getElementById('videoOverlay');
    var context = canvas.getContext('2d');
    console.log('canvas: ', canvas);
    var dirty = false;
    socket.on('faces', function(faces) {
        if (dirty) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            dirty = false;
        }
        _(faces).each(function(face) {
            dirty = true;
            console.log('face: ', face)
            context.globalAlpha = 0.5;
            context.beginPath();
            context.arc(face.x + face.width / 2, face.y + face.width / 2, face.width / 2, 0, 2 * Math.PI, true);
            context.lineWidth = 2;
            context.strokeStyle = 'red';
            context.stroke();
        })
    })
});
