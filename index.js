var arDrone = require('ar-drone'),
    client = arDrone.createClient(),
    xbox = require('./copter_js/xbox_mapping')(client),
    talker = require('./copter_js/talker'),
    pngStream = client.getPngStream(),
    findHumans = require('./copter_js/find_humans')(client,pngStream),
    countHumans = require('./copter_js/count_humans')(pngStream),
    server = require('./web_server')();


talker('Hi, What should we do to day.').then(function() {
    talker('Lets play some games.');
});
xbox.on('leftshoulder:release', function(key) {
    talker('I want to play a game.').then(function() {
        talker('Lets see how many humans i can find.').then(function() {
            setTimeout(function() {
                countHumans();
            }, 3000);
        })
    })
});

xbox.on('rightshoulder:release', function(key) {
    talker('Lets find some puny humans').then(function() {
        findHumans(true);
    })
});

require('dronestatus').listen(server);
require("dronestream").listen(server, {
    tcpVideoStream: client.getVideoStream()
});

var io = require('socket.io')(server);
io.on('connection', function(socket) {
    findHumans.setSocket(socket);
});




