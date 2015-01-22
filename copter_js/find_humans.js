var _ = require('underscore'),
    cv = require('opencv'),
    gameOn = false,
    say = require('./say'),
    path = require('path'),
    imgCount = 0,
    excTime = 200,
    client, pngStream, socket;
var hc_path = path.join(path.dirname(require.resolve("opencv")), '..', 'data');
var opencvConf = path.join(hc_path, "haarcascade_frontalface_alt2.xml");

var findClosest = function(centerX, centerY, faces) {
    var a = _.chain(faces).sortBy(function(face) {
        var faceLength = Math.sqrt(Math.pow(centerX - face.x, 2) + Math.pow(centerY - face.y, 2));
        face.rate = faceLength;
        return faceLength;
    }).value();
    return _(a).first();
}
var waiting = 1;
var moveSize = 0.3
var chainMove = function(list) {
    if (list.length > 0 && gameOn) {
        var action = list.pop();
        socket.emit('moving', action);
        if (action == "forward") {
            client.front(moveSize);
        }
        if (action == "backward") {
            client.back(moveSize);
        }
        if (action == "turnRight") {
            client.clockwise(moveSize);
        }
        if (action == "turnLeft") {
            client.counterClockwise(moveSize);
        }
        if (action == "higher") {
            client.up(moveSize / 4);
        }
        if (action == "lower") {
            client.down(moveSize / 4);
        }
        console.log('done', action);
        setTimeout(function() {
            client.stop();
            console.log('stop start new action');
            chainMove(list);
        }, 400);
    } else {
        LOCKED = false;
    }
}

var searchForHuman = function() {
    //TODO
}
var LOCKED = false;
var findTheHumans = function(img, faces) {
    if (faces.length == 0 || LOCKED) {
        return;
    }
    LOCKED = true;
    socket.emit('faces', faces);
    var commands = {};
    var centerX = img.width() / 2;
    var centerY = img.height() / 2;
    var offset = 100;
    var currentFace = faces.length > 1 ? findClosest(centerX, centerY, faces) : faces[0];

    if (currentFace.height * currentFace.width < 20000) {
        commands.forward = true;
    } else {
        LOCKED = true;
        gameIsOn(false);
        say('hello human.').then(function() {
            img.save('./human_found/humanfound'+imgCount+'.jpg');
            imgCount++;
            client.animate('phiDance',2000);
            setTimeout(function() {
                client.stop();
                LOCKED = false;
            },2000);
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
    var commandArray = _.keys(commands);
    console.log('commandArray', commandArray);
    if (commandArray.length > 0) {
        chainMove(commandArray);
    } else {
        LOCKED = false;
    }

}
var gameIsOn = function(ison) {
    gameOn = ison;
}

var handleStream = function() {
    var s = new cv.ImageStream()
    s.on('data', function(matrix) {
        if (gameOn) {
            hrend = process.hrtime(hrstart);
            if (hrend[0] >= 2) {
                matrix.convertGrayscale();
                matrix.save('find_tmp.png');

                cv.readImage("./find_tmp.png", function(err, im) {
                    im.detectObject(opencvConf, {
                        ScaleDecreaseFraction: 0.5,
                        scaleFactor: 1.1,
                        minNeighbors: 5,
                        min: [70, 70],

                    }, function(err, faces) {
                        if (faces.length > 0) {
                            findTheHumans(im, faces)
                        }

                    });
                })

                hrstart = process.hrtime();
            }
        }
    })
    pngStream.pipe(s);
}

var setSocket = function(_socket) {
    socket = _socket;
}
var hrstart = process.hrtime();
var init = function(_client, _pngStream) {
    pngStream = _pngStream;
    client = _client;
    handleStream();
    return {
        "setSocket": setSocket,
        "gameIsOn": gameIsOn,
    }
}
module.exports = init;
