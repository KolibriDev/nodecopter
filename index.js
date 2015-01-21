var arDrone = require('ar-drone'),
    client = arDrone.createClient({frameRate:2}),
    say = require('./copter_js/say'),
    pngStream = client.getPngStream(),
    videoStream = client.getVideoStream(),
    twitterConf = require('./twitter.conf.json')
    twitter = require('./copter_js/twitter')(twitterConf),
    findHumans = require('./copter_js/find_humans')(client, pngStream),
    countHumans = require('./copter_js/count_humans')(pngStream,twitter),
    server = require('./web_server')();

client.config('general:navdata_demo', 'FALSE');
var controller = require('./copter_js/dualshock_mapping')({
    client: client,
    say: say,
});

// var doneSay = false;
// videoStream.on('error', function(err) {
//     if (!doneSay) {
//         say('Ohh dear, it seems like i have lost my sight.').then(function() {
//             say('Trying to reconnect to video stream');
//         })
//         doneSay = true;
//     }

// })

// require('dronestatus').listen(server);

controller.on('psxButton:press', function() {
    require('dronestream').listen(server, {
        tcpVideoStream: videoStream
    });

    var io = require('socket.io')(server);
    io.on('connection', function(socket) {
        findHumans.setSocket(socket);
        say.setSocket(socket);
    });
});
controller.on('l1:press', function() {
    say('Lets see how many humans i can find.').then(function() {
        countHumans();
    });
});

controller.on('r1:press', function() {
    say('Lets find some puny humans.').then(function() {
        findHumans(true);
    });
});
controller.on('triangle:press', function() {
    findHumans.tweetImage(true);
});
controller.on('circle:press', function() {
    findHumans.tweetImage(false);
});
