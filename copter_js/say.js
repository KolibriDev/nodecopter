var spawn = require('child_process').spawn,
    Q = require('q');
var SOCKET;
var index = 0;
var say = function(text) {
    index++;
    var deffered = Q.defer();
    var exc = spawn('say', [text, '-v', 'Vicki']);
    console.log('-------'+index+': '+text);
    if (SOCKET) {
        SOCKET.emit('say', {index: index, text: text});
    }
    exc.stdout.on('close', function() {
        if (SOCKET) {
            SOCKET.emit('saydone', {index: index, text: text});
        }
        return deffered.resolve();
    });
    return deffered.promise;
};
say.setSocket = function(socket) {
    SOCKET = socket;
};
module.exports = say;
