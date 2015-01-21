var cv = require('opencv'),
    faceArray = new Array(10),
    _ = require('underscore'),
    say = require('./say'),
    path = require('path'),
    arrayCount = 0,
    _numberOfHumans = 0,
    _grabImage = false,
    twitter;

var hcPath = path.join(path.dirname(require.resolve('opencv')), '..', 'data');
var opencvConf = path.join(hcPath, 'haarcascade_frontalface_alt2.xml');

var countHumans = function() {
    var nrOfHumans = _.chain(faceArray).countBy().pairs().max(_.last).head().value();
    say('I see ' + nrOfHumans + (nrOfHumans > 1 ? ' humans.' : ' human.')).then(function () {
        say('Would you like to share this with some random strangers?');
    });
    _numberOfHumans = nrOfHumans;
    _grabImage = true;
};
var tweetImage = function(tweetIt) {
    if (tweetIt) {
        var text = 'Hi, check out ' + (_numberOfHumans > 1 ? 'these ' + _numberOfHumans + ' humans I found.' : 'this human I found.');
        twitter.statusWithImage(text, 'imageTweet.jpeg');
        say('Tweeting done.');
    }
    else{
        say('It was a bad picture anyway.');
    }

};
var imageProccessing = function(buffer) {
    matrix.detectObject(opencvConf, {
        ScaleDecreaseFraction: 0.2,
        scaleFactor: 1.1,
        minNeighbors: 5,
        min: [70, 70],
    }, function(err, matches) {
        faceArray[arrayCount] = matches.length;
        arrayCount = (arrayCount + 1) % 10;

    });
    if (_grabImage) {
        matrix.save('imageTweet.jpeg');
        _grabImage = false;
    }
};
countHumans.tweetImage = tweetImage;
module.exports = function(stream, _twitter) {
    stream.on('data', imageProccessing);
    twitter = _twitter;
    return countHumans;
};
