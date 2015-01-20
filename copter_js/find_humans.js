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
var whaiting = 1000;
var moveSize = 0.2
var chainMove = function(list, after) {
    after = after || client;
    if (list > 0) {
        var action = list.pop();
        var recurs = after.after(whaiting, function() {
            if (cmd == "forward") {
                this.front(moveSize);
            }
            // if (cmd == "backward") {
            //     this.back(0.2);
            //     setTimeout(function() {
            //         this.back(0);
            //     }, excTime);
            // }
            if (cmd == "turnRight") {
                this.clockwise(moveSize);
            }
            if (cmd == "turnLeft") {
                this.counterClockwise(moveSize);
            }
            if (cmd == "higher") {
                this.up(moveSize);
            }
            if (cmd == "lower") {
                this.down(moveSize);
            }
        }).after(800, function() {
            this.stop()
        });
        chainMove(list, recurs);
    }
}

var makeMovement = function(commands) {
    var comandArray = _.keys(commands);
    if (comandArray.length > 0) {
        chainMove(comandArray);
    } else {
        LOCKED = false;
    }
}
var searchForHuman = function() {
    //TODO
}
var LOCKED = false;
var findTheHumans = function(img, faces) {
    console.log(LOCKED);
    if (faces.length == 0 || LOCKED) {
        // socket.emit('faces', []);
        return;
    }
    LOCKED = true;

    socket.emit('faces', faces.map(function(face) {
        return {
            x: face.x,
            y: face.y,
            height: face.height,
            width: face.width
        }
    }));
    console.log(faces);
    var commands = {};
    var centerX = img.width / 2;
    var centerY = img.height / 2;
    var offset = 100;
    var currentFace = faces.length > 1 ? findClosest(centerX, centerY, faces) : faces[0];

    if (currentFace.height * currentFace.width < 20000) {
        commands.forward = true;
    } else {
        LOCKED = true;
        say('hello human.').then(function() {
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
    // pngStream.on('data', handleStream);
}

var handleStream = function() {
    var s = new cv.ImageStream()
    s.on('data', function(matrix) {
        if (gameOn) {
            hrend = process.hrtime(hrstart);
            if (hrend[0] >= 1) {
                matrix.detectObject(opencvConf, {
                    ScaleDecreaseFraction: 0.2
                }, function(err, matches) {
                    if(matches.length > 0){
                        findTheHumans(matrix,matches)
                    }
                })
                hrstart = process.hrtime();
            }
        }
    })
    pngStream.pipe(s);
}
gameIsOn.closest = findClosest;
gameIsOn.setSocket = function(_socket) {
    socket = _socket;
}
var hrstart = process.hrtime();
module.exports = function(_client, _pngStream) {
    pngStream = _pngStream;
    client = _client;
    handleStream();
    return gameIsOn
};
