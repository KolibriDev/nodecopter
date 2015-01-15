'use strict';

module.exports = function(gulp) {
  gulp.task('build', ['rimraf'], function() {
    return gulp.start('scripts', 'styles', 'templates', 'images', 'copy');
  });
};
