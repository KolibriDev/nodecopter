var _ = require('underscore'),
    Faced = require('../node_modules/faced/lib/faced'),
    faced = new Faced(),
    gameOn = false,
    talker = require('./talker'),
    path = require('path'),
    imgCount = 0,
    excTime = 200,
    client, pngStream, socket;

var findClosest = function(centerX, centerY, faces) {
    var a = _.chain(faces).sortBy(function(face) {
        // var faceSize = ((centerX * centerY) - (face.height * face.width)) * 0.01;
        var faceLength = Math.sqrt(Math.pow(centerX - face.x, 2) + Math.pow(centerY - face.y, 2));
        face.rate = faceLength;
        return faceLength;
    }).value();
    return _(a).first();
}

var makeMovement = function(commands) {
    var comandArray = _.keys(commands);
    if (comandArray.length > 0) {
        LOCKED = true;

        _(comandArray).each(function(cmd) {
            console.log('Movement: ', cmd);
            if (cmd == "forward") {
                client.front(0.2);
                setTimeout(function() {
                    client.front(0);
                }, excTime);
            }
            // if (cmd == "backward") {
            //     client.back(0.2);
            //     setTimeout(function() {
            //         client.back(0);
            //     }, excTime);
            // }
            if (cmd == "turnRight") {
                client.clockwise(0.1);
                setTimeout(function() {
                    client.clockwise(0);
                }, excTime);
            }
            if (cmd == "turnLeft") {
                client.counterClockwise(0.1);
                setTimeout(function() {
                    client.counterClockwise(0);
                }, excTime);
            }
            if (cmd == "higher") {
                client.up(0.1);
                setTimeout(function() {
                    client.up(0);
                }, excTime);
            }
            if (cmd == "lower") {
                client.down(0.1);
                setTimeout(function() {
                    client.down(0);
                }, excTime);
                // setTimeout(function() {
                //     followingTheHuman = false;
                // }, 200);
            }
            client.after(200, function() {
                LOCKED = false;
            });
        });
    }
}
var searchForHuman = function() {
    //TODO
}
var LOCKED = false;
var findTheHumans = function(img, faces) {
    if (faces.length == 0) {
        console.log('noface');
    }
    if (faces.length == 0 || LOCKED) {
        // socket.emit('faces', []);
        return;
    }
    socket.emit('faces', faces);
    var commands = {};
    var centerX = img.width / 2;
    var centerY = img.height / 2;
    var offset = 100;
    var currentFace = findClosest(centerX, centerY, faces);
    // img.ellipse(currentFace.x + currentFace.width / 2, currentFace.y + currentFace.height / 2, currentFace.width / 2, currentFace.height / 2);
    // img.save('./dump/out' + imgCount + '.jpg');
    // imgCount++;

    if (currentFace.height * currentFace.width < 20000) {
        commands.forward = true;
    } else {
        LOCKED = true;
        talker('hello human.').then(function() {
            client.after(1000, function() {
                client.back(0.3)
            }).after(1000, function() {
                client.back(0);
                client.clockwise(0.5);
            }).after(1000, function() {
                client.clockwise(0);
                LOCKED = false;
            });
        })
    }
    var diffX = centerX - currentFace.x;
    var diffY = centerY - currentFace.y;
    if (Math.abs(diffX) > offset) {
        if (diffX < 0) {
            commands.turnRight = true;
        } else if (diffX > 0) {
            commands.turnLeft = true;
        }
    }
    if (Math.abs(diffY) > offset) {
        if (diffY < 0) {
            commands.lower = true;
        } else if (diffY > 0) {
            commands.higher = true;
        }
    }
    makeMovement(commands);
}
var gameIsOn = function(ison) {
    gameOn = ison;
}
var hrstart = process.hrtime();
var handleStream = function(buffer) {
    if (gameOn) {
        hrend = process.hrtime(hrstart);
        if (hrend[0] >= 1) {
            console.time("readimg")
            faced.detect(buffer, function(faces, img, file) {
                console.log()
                if (faces.length > 0) {
                    findTheHumans(img, faces);
                }

            });
            // findTheHumans(img, result);
            // cv.readImage(buffer, function(err, im) {
            //     if (err) {
            //         console.log('CV Error: ', err);
            //     }

            //     im.detectObject(detectio_cascate, {
            //         neighbors: 6,
            //         min: [50, 50]
            //     }, function(err, faces) {
            //         if (faces.length > 0) {
            //             im.detectObject(detectio_cascate2, {}, function(err, eye) {
            //                 if (eye.length > 0) {
            //                     findTheHumans(im, faces);
            //                 }
            //             });
            //         }
            //         findTheHumans(im, faces);
            //     });

            // });
            // console.log('Found ' + result.length + ' faces.');

            // for (var i = 0; i < result.length; i++) {
            //     var face = result[i];
            //     console.log(face);
            // }
            console.timeEnd("readimg")
            hrstart = process.hrtime();
            // hrend = process.hrtime(hrstart);
            // console.log(hrend);
        }
    }
}
gameIsOn.closest = findClosest;
gameIsOn.setSocket = function(_socket) {
    socket = _socket;
}
module.exports = function(_client, _pngStream) {
    pngStream = _pngStream;
    pngStream.on('data', handleStream);
    client = _client;
    return gameIsOn
};
