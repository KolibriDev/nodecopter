var spawn = require('child_process').spawn,
    Q = require('q');
var SOCKET;
var say = function(text) {
    var deffered = Q.defer();
    var exc = spawn('say', [text, '-v', 'Vicki']);
    if (SOCKET) {
        SOCKET.emit('say', text);
    }
    exc.stdout.on('close', function() {
        return deffered.resolve();
    })
    return deffered.promise;
}
say.setSocket = function(socket) {
    SOCKET = socket;
}
module.exports = say;
