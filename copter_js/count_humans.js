var Faced = require('../node_modules/faced/lib/faced'),
    faced = new Faced();
    faceArray = new Array(10),
    _ = require('underscore'),
    talker = require('./talker'),
    arrayCount = 0;
var countHumans = function() {
    var nrOfHumans = _.chain(faceArray).countBy().pairs().max(_.last).head().value();
    talker('I see ' + nrOfHumans + (nrOfHumans > 1 ? ' humans.' : ' human.'))
}
var imageProccessing = function(buffer) {
    faced.detect(buffer, function(faces, img, file) {
        faceArray[arrayCount] = faces.length;
        arrayCount = (arrayCount + 1) % 10;
        img.save('~/Downloads/copter-ui/dev/img/selfie' + arrayCount + '.jpg');
    });
}
module.exports = function(stream) {
    stream.on('data', imageProccessing);
    return countHumans;
};
