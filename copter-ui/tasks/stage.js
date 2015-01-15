'use strict';

module.exports = function(gulp) {
  var spawn = require('child_process').spawn,
      Q = require('q');

  if (!gulp.cfg.hasOwnProperty('cmd')) {
    console.error('cmd object is missing from configuration.');
    return;
  }
  var cmd = gulp.cfg.cmd;

  gulp.task('stage', function() {
    var deferred = Q.defer();

    if (cmd.hasOwnProperty('stage') && cmd.stage !== '') {
      var stage = spawn(cmd.stage);
      stage.stdout.on('data', function(data) {
        process.stdout.write(data);
      });

      stage.stdout.on('close', function(){
        return deferred.resolve();
      });
    } else {
      console.log('stage command is missing! Add cmd.stage to blender.json to use this task!');
      return deferred.resolve();
    }

    return deferred.promise;
  });
};
