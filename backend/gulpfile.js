// Load plugins
var gulp = require('gulp');
    // autoprefixer = require('gulp-autoprefixer'),
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');

    // cache = require('gulp-cache'),
    // del = require('del');
    // source = require('vinyl-source-stream');
    // watchify = require('watchify');
    // streamify = require('gulp-streamify');
var srcPath = {
  allScript : ['./bin/www', './routes/*.js', './lib/*js', './app.js', './database/*js', './config.js', './test/*.js'],
  test: './test',
}
// Scripts
gulp.task('jshint', function() {
  return gulp.src(srcPath.allScript)
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('default'))
    // .pipe(notify({ message: 'jshint task complete' }));
});

gulp.task('test', function () {
  return gulp.src(srcPath.test, {read: false})
    .pipe(mocha({reporter: 'nyan'}))
    .once('error', () => {
        process.exit(1);
    })
    .once('end', () => {
        process.exit();
    });
});


// Watch
gulp.task('watch', function() {
  gulp.watch(srcPath.allScript, ['jshint']);
});

//start nodemon
gulp.task('start', function () {
  nodemon({
    script: './bin/www'
  , ext: 'js'
  , env: { 'NODE_ENV': 'development','DEBUG': 'api:*' }
  })
})

 

gulp.task('default', ['jshint', 'watch', 'start']);
// gulp.task('production', ['replaceHTML', 'build']);


//    var ts = require('gulp-typescript');
 
// gulp.task('ts', function () {
//   return gulp.src('ts/**/*.ts')
//     .pipe(ts({
//       noImplicitAny: true,
//       // out: 'output.js'
//     }))
//     .pipe(gulp.dest('after'));
// });