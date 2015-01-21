var arDrone = require('ar-drone'),
    client = arDrone.createClient({
        frameRate: 2
    }),
    say = require('./copter_js/say'),
    pngStream = client.getPngStream(),
    videoStream = client.getVideoStream(),
    twitterConf = require('./twitter.conf.json'),
    twitter = require('./copter_js/twitter')(twitterConf),
    findHumans = require('./copter_js/find_humans')(client, pngStream),
    countHumans = require('./copter_js/count_humans')(pngStream, twitter),
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


var initialized = false;
controller.on('psxButton:press', function() {
    if (initialized) { return; }
    initialized = true;
    require('dronestatus').listen(server);
    require('dronestream').listen(server, {
        tcpVideoStream: videoStream
    });

    var io = require('socket.io')(server);
    io.on('connection', function(socket) {
        findHumans.setSocket(socket);
        say.setSocket(socket);
    });
});
// say('Lets see how many humans i can find.').then(function() {
//         countHumans.gameIsOn(true);
//         findHumans.gameIsOn(false);
//         console.log('then done');
//         setTimeout(function() {
//             console.log('start it');
//             countHumans();
//         }, 2000);
//     });
controller.on('l1:press', function() {
    say('Lets see how many humans i can find.').then(function() {
        console.log('then done');
        console.log(countHumans);
        countHumans.gameIsOn(true);
        findHumans.gameIsOn(false);
        setTimeout(function() {
            console.log('how many?')
            countHumans.howMany();

        }, 2000);
    }, function(err) {
        console.log(err);
    }).fail(function(err) {
        console.log('err', err);
    });
});

controller.on('r1:press', function() {
    say('Lets find some puny humans.').then(function() {
        findHumans.gameIsOn(true);
        countHumans.gameIsOn(false);
    });
});
controller.on('triangle:press', function() {
    countHumans.tweetImage(true);
});
controller.on('circle:press', function() {
    countHumans.tweetImage(false);
});
controller.on('share:press', function() {
    countHumans.gameIsOn(false);
    findHumans.gameIsOn(false);
});
