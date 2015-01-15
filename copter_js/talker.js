var	spawn = require('child_process').spawn,
	Q = require('q');

var talker = function(text) {
    var deffered = Q.defer();
    var exc = spawn('say', [text, '-v', 'Vicki']);
    exc.stdout.on('close', function() {
        return deffered.resolve();
    })
    return deffered.promise;
}
module.exports = talker;