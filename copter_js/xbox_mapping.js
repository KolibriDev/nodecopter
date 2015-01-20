var client;

var XboxController = require('xbox-controller'),
    xbox = new XboxController,
    stickMaxPos = 32727,
    stickMaxNeg = -32768,
    triggerMax = 255,
    lightTouch = true;
var calibrate = true;
var setup = function() {


    xbox.on('b:release', function(key) {
        client.land();
    });

    xbox.on('y:release', function(key) {
        client.stop();
        gameOn = "";
    });

    xbox.on('x:release', function(key) {
        calibrate = true;

    });

    // xbox.on('leftshoulder:release', function(key) {
    // });

    // xbox.on('rightshoulder:release', function(key) {
    // });

    xbox.on('back:release', function(key) {
        lightTouch = !lightTouch;
        console.log(lightTouch ? "Light Touch Mode" : "Full Speed Mode");
        lightTouch ? xbox.setLed(0x01) : xbox.setLed(0x0A);
    });

    xbox.on('lefttrigger', function(position) {
        client.counterClockwise(position / triggerMax);
        client.animate('flipLeft', 750);
    })

    xbox.on('righttrigger', function(position) {
        client.clockwise(position / triggerMax);
    })

    xbox.on('left:move', function(position) {
        if (calibrate) {
            return;
        }
        var normFront = 0,
            normLeft = 0,
            forwards = true,
            left = true;

        if (position.y < 0) {
            normFront = position.y / stickMaxNeg;
        } else {
            forwards = false;
            normFront = position.y / stickMaxPos;
        }

        if (position.x < 0) {
            normLeft = position.x / stickMaxNeg;
        } else {
            left = false;
            normLeft = position.x / stickMaxPos;
        }

        if (normFront != 0) {
            if (lightTouch) normFront = normFront / 2;
            forwards ? client.front(normFront) : client.back(normFront);
        } else {
            client.front(normFront);
            client.back(normFront);
        }

        if (normLeft != 0) {
            if (lightTouch) normLeft = normLeft / 2;
            left ? client.left(normLeft) : client.right(normLeft);

        } else {
            client.left(normLeft);
            client.right(normLeft);
        }
    });
    var hrstart = process.hrtime();

    xbox.on('right:move', function(position) {
        var normUp = 0;
        normRotateLeft = 0,
            up = true,
            left = true;
        if (calibrate) {
            return;
        }

        if (position.y < 0) {
            normUp = position.y / stickMaxNeg;
        } else {
            up = false;
            normUp = position.y / stickMaxPos;
        }

        if (position.x < 0) {
            left = false;
            normRotateLeft = position.x / stickMaxNeg;
        } else {

            normRotateLeft = position.x / stickMaxPos;
        }
        var hrend = process.hrtime(hrstart);
        if (normUp != 0) {
            if (lightTouch) normUp = normUp / 2;
            up ? client.up(normUp) : client.down(normUp);
        } else {
            client.up(normUp);
            client.down(normUp);
        }

        if (normRotateLeft != 0) {
            console.log(hrend, 'normRotateLeft', normRotateLeft / 2);
            if (lightTouch) normRotateLeft = normRotateLeft / 2;
            left ? client.clockwise(normRotateLeft) : client.counterClockwise(normRotateLeft);
        } else {
            console.log(hrend, 'done');
            client.clockwise(normRotateLeft);
            client.counterClockwise(normRotateLeft);
        }
        hrstart = process.hrtime();
    });


    xbox.setLed(0x01);
}
module.exports = function(_client) {
    client = _client;
    xbox.on('a:release', function(key) {
        client.takeoff();
        client.after(2000, function() {
            console.log('start calibration');
            client.calibrate(0);
        }).after(5000, function() {
            console.log('end calibration');
            calibrate = false;
            setup();
        })
    });
    return xbox;
};
