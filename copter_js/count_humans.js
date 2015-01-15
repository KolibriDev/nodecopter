var cv = require('opencv'),
    faceArray = new Array(10),
    _ = require('underscore'),
    talker = require('./talker'),
    arrayCount = 0;
var countHumans = function() {
    var nrOfHumans = _.chain(faceArray).countBy().pairs().max(_.last).head().value();
    talker('I see ' + nrOfHumans + (nrOfHumans > 1 ? ' humans.' : ' human.'))
}
var imageProccessing = function(buffer) {
    cv.readImage(buffer, function(err, im) {
        im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
            faceArray[arrayCount] = faces.length;
            arrayCount = (arrayCount + 1) % 10;
            im.save('~/Downloads/copter-ui/dev/img/selfie' + arrayCount + '.jpg');
        });
    });
}
module.exports = function(stream) {
    stream.on('data', imageProccessing);
    return countHumans;
};
