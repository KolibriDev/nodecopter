'use strict';

module.exports = function(gulp) {
  var spawn = require('child_process').spawn,
      Q = require('q');

  if (!gulp.cfg.hasOwnProperty('cmd')) {
    console.error('cmd object is missing from configuration.');
    return;
  }
  var cmd = gulp.cfg.cmd;

  gulp.task('assets', function() {
    var deferred = Q.defer();

    if (cmd.hasOwnProperty('assets') && cmd.assets !== '') {
      var assets = spawn(cmd.assets);
      assets.stdout.on('data', function(data) {
        process.stdout.write(data);
      });

      assets.stdout.on('close', function(){
        return deferred.resolve();
      });
    } else {
      console.log('assets command is missing! Add cmd.assets to blender.json to use this task!');
      return deferred.resolve();
    }

    return deferred.promise;
  });
};
