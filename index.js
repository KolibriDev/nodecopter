var arDrone = require('ar-drone'),
    client = arDrone.createClient({frameRate:2}),
    xbox = require('./copter_js/xbox_mapping')(client),
    say = require('./copter_js/say');


// say('Hi, What should we do to day.').then(function() {
//     say('Lets play some games.');
// });

xbox.on('connect', function(argument) {
    console.log('Controler connected setting upp');
    var pngStream = client.getPngStream(),
        videoStream = client.getVideoStream(),
        findHumans = require('./copter_js/find_humans')(client, pngStream),
        // countHumans = require('./copter_js/count_humans')(pngStream),
        server = require('./web_server')();
    var doneSay = false;
    videoStream.on('error', function(err) {
        if (!doneSay) {
            say('Ohh dear, it seems like i have lost my sight.').then(function() {
                say('Trying to reconnect to video stream');
            })
            doneSay = true;
        }

    })
    // require('dronestatus').listen(server);
    require("dronestream").listen(server, {
        tcpVideoStream: videoStream
    });

    var io = require('socket.io')(server);
    io.on('connection', function(socket) {
        findHumans.setSocket(socket);
        say.setSocket(socket);
    });
    xbox.on('leftshoulder:release', function(key) {
        say('I want to play a game.').then(function() {
            say('Lets see how many humans i can find.').then(function() {
                setTimeout(function() {
                    countHumans();
                }, 3000);
            })
        })
    });

    xbox.on('rightshoulder:release', function(key) {
        say('Lets find some puny humans').then(function() {
            findHumans(true);
        })
    });
});
