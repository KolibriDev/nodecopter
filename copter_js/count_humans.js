var cv = require('opencv'),
    faceArray = new Array(10),
    _ = require('underscore'),
    say = require('./say'),
    path = require('path'),
    gameOn = false,
    arrayCount = 0,
    _numberOfHumans = 0,
    _grabImage = false,
    takeSingle = false,
    twitter;

var hcPath = path.join(path.dirname(require.resolve('opencv')), '..', 'data');
var opencvConf = path.join(hcPath, 'haarcascade_frontalface_alt2.xml');

var countHumans = function() {
    console.log('Counting humans');
    var nrOfHumans = _.chain(faceArray).countBy().pairs().max(_.last).head().value();
    if (!nrOfHumans || nrOfHumans < 1) {
        say('I can\'t seem to find any humans').then(function() {
            say('Should we try again?');
        });
    } else {
        say('I see ' + nrOfHumans + (nrOfHumans > 1 ? ' humans' : ' human')).then(function () {
            say('Would you like to share this with some random strangers?');
        });
    }
    _numberOfHumans = nrOfHumans;
    _grabImage = true;
};
var tweetImage = function(tweetIt) {
    if (!gameOn) { return; }
    if (tweetIt) {
        var texts = [
            'Hey, check out ' + (_numberOfHumans > 1 ? 'these ' + _numberOfHumans + ' humans I found.' : 'this human I found.'),
            (_numberOfHumans > 1 ? 'These ' + _numberOfHumans + ' humans are my new friends.' : 'This human is my new friend.')
        ];

        var text = texts[_.random(0,texts.length-1)];
        twitter.statusWithImage(text, 'imageTweet.jpeg');
        say('I have tweeted a new tweet to twitter, saying:').then(function(){
            say(text);
        });
    } else {
        say("Oh well").then(function(){
            say('Guess it was a bad picture anyway');
        });
    }

}

var triggerTakeSingle = function () {
    takeSingle = true;
}

var tweetSingle = function () {
    var texts = [
            'Look at this!',
            'This is what I am seeing right now',
            'I am at a javascript meetup in #iceland'
        ];

    var text = texts[_.random(0,texts.length-1)] + ' #drone #parrotdrone #nodecopter';
    twitter.statusWithImage(text, 'imageTweet.jpeg');
    say('I have tweeted a new tweet to twitter, saying:').then(function(){
        say(text);
    });
}
var imageProccessing = function(matrix) {
    if (gameOn || takeSingle) {
        matrix.save('count_tmp.png');

        cv.readImage("./count_tmp.png", function(err, im) {
            im.detectObject(opencvConf, {
                ScaleDecreaseFraction: 0.2,
                scaleFactor: 1.1,
                minNeighbors: 5,
                min: [70, 70],

            }, function(err, faces) {
                faceArray[arrayCount] = faces.length;
                arrayCount = (arrayCount + 1) % 10;
            });
        })
            // matrix.detectObject(opencvConf, {
            //     ScaleDecreaseFraction: 0.2,
            //     scaleFactor: 1.1,
            //     minNeighbors: 5,
            //     min: [70, 70],
            // }, function(err, matches) {
            //     faceArray[arrayCount] = matches.length;
            //     arrayCount = (arrayCount + 1) % 10;

        // })
        if (_grabImage || takeSingle) {
            matrix.save('imageTweet.jpeg');
            _grabImage = false;
            if(takeSingle){
                tweetSingle();
            }
            takeSingle = false;
        }
    }
}
var gameIsOn = function(ison) {
    gameOn = ison;
};
var init = function (pngStream, _twitter) {
    var s = new cv.ImageStream();
    pngStream.pipe(s);
    s.on('data', imageProccessing);
    twitter = _twitter;
    return {
        "triggerTakeSingle":triggerTakeSingle,
        "tweetImage":tweetImage,
        "gameIsOn":gameIsOn,
        "howMany":countHumans
    }
}

module.exports = init;
