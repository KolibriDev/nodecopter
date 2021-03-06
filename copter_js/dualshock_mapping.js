'use strict';
var navdata = {};

var dualShockCtrl = require('dualshock-controller'),
    dualshock = dualShockCtrl({
        config: 'dualshock4-generic-driver'
    }),
    stickMaxPos = 128,
    stickMaxNeg = -127,
    // triggerMax = 255,
    lightTouch = true,
    initialized = false,
    calibrating = true;

// var controllerConfiguration = require('./dualshock4-generic-driver');
// require('./consolePrintControllerEvents')(dualshock,controllerConfiguration);
var setup = function(options) {
    var client = options.client;
    var say = options.say;
    client.on('navdata', function(data) {
        navdata = data;
    });
    dualshock.on('touchPad:press', function() {
        if (navdata.droneState.flying === 1) {
            client.land();
            say('Going down');
        } else {
            client.takeoff();
            say('Going up');
            client.after(1000, function() {
                console.log('start calibration');
                client.calibrate(0);
            }).after(5000, function() {
                console.log('end calibration');
                calibrating = false;
            });
        }
    });
    dualshock.on('x:press', function() {
        calibrating = true;
        say('Lets dance');
        client.animate('phiDance',2000);
        setTimeout(function() {
            calibrating = false;
        },5000);
    });
    dualshock.on('square:press', function() {
        calibrating = true;
        console.log('start calibration');
        say('Calibrating');
        client.calibrate(0);
        client.after(5000, function() {
            console.log('end calibration');
            calibrating = false;
            say('Done calibrating');
        });
    });
    dualshock.on('options:press', function() {
        lightTouch = !lightTouch;
        console.log(lightTouch ? 'Light Touch Mode' : 'Full Speed Mode');
    });
    dualshock.on('dpadUp:press', function() {
        client.animate('flipAhead', 750);
        client.after(750, function() {
            client.stop();
        });
    });
    dualshock.on('dpadLeft:press', function() {
        client.animate('flipLeft', 750);
        client.after(750, function() {
            client.stop();
        });
    });
    dualshock.on('dpadRight:press', function() {
        client.animate('flipRight', 750);
        client.after(750, function() {
            client.stop();
        });
    });
    dualshock.on('dpadDown:press', function() {
        client.animate('yawDance', 2000);
    });
    dualshock.on('left:move', function(position) {
        if (calibrating) { return; }
        var normFront = 0,
            normLeft = 0,
            forwards = true,
            left = true,
            pos = {
                x: position.x - 127,
                y: position.y - 127
            };
            pos.x = pos.x > 0 ? (pos.x < 0.1 ? 0 : pos.x) : (pos.x > 0.1 ? 0 : pos.x);
            pos.y = pos.y > 0 ? (pos.y < 0.1 ? 0 : pos.y) : (pos.y > 0.1 ? 0 : pos.y);

        if (pos.y < 0) {
            normFront = pos.y / stickMaxNeg;
        } else {
            forwards = false;
            normFront = pos.y / stickMaxPos;
        }

        if (pos.x < 0) {
            normLeft = pos.x / stickMaxNeg;
        } else {
            left = false;
            normLeft = pos.x / stickMaxPos;
        }

        if (normFront !== 0) {
            if (lightTouch) { normFront = normFront / 2; }
            if (forwards) {
                client.front(normFront);
            } else {
                client.back(normFront);
            }
        } else {
            client.front(normFront);
            client.back(normFront);
        }

        if (normLeft !== 0) {
            if (lightTouch) { normLeft = normLeft / 2; }
            if (left) {
                client.left(normLeft);
            } else {
                client.right(normLeft);
            }

        } else {
            client.left(normLeft);
            client.right(normLeft);
        }
    });
    dualshock.on('right:move', function(position) {
        if (calibrating) { return; }
        var normUp = 0,
            normRotateLeft = 0,
            up = true,
            left = true,
            pos = {
                x: position.x - 127,
                y: position.y - 127
            };

        if (pos.y < 0) {
            normUp = pos.y / stickMaxNeg;
        } else {
            up = false;
            normUp = pos.y / stickMaxPos;
        }

        if (pos.x < 0) {
            left = false;
            normRotateLeft = pos.x / stickMaxNeg;
        } else {
            normRotateLeft = pos.x / stickMaxPos;
        }

        if (normUp !== 0) {
            if (lightTouch) { normUp = normUp / 2; }
            if (up) {
                client.up(normUp);
            } else {
                client.down(normUp);
            }
        } else {
            client.up(normUp);
            client.down(normUp);
        }

        if (normRotateLeft !== 0) {
            if (lightTouch) { normRotateLeft = normRotateLeft / 2; }
            if (left) {
                client.clockwise(normRotateLeft);
            } else {
                client.counterClockwise(normRotateLeft);
            }
        } else {
            client.clockwise(normRotateLeft);
            client.counterClockwise(normRotateLeft);
        }
    });
};

module.exports = function(_options) {
    dualshock.on('psxButton:press', function() {
        if (initialized) {
            _options.client.stop();
            _options.client.land();
            _options.say('Well, that was fun').then(function(){
                _options.say('I suppose').then(function(){
                    _options.say('Goodbye, for now').then(function(){
                        process.exit(0);
                    });
                });
            });
        } else {
            initialized = true;
            _options.say('Hi, my name happens to be Molly').then(function() {
                _options.say('To take me for a spin,').then(function() {
                    _options.say('press the touch pad once with enthusiasm').then(function() {
                        setup(_options);
                    });
                });
            });
        }
    });
    return dualshock;
};
