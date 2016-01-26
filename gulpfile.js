  var url = require('url');
// Load plugins

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    htmlreplace = require('gulp-html-replace'), // need
    del = require('del'),
		connect = require('gulp-connect'),
		watch = require('gulp-watch'),
		Proxy = require('proxy-middleware'),
    combiner = require('stream-combiner2'),
    jade = require('gulp-jade')
    

var srcPath = {
  SRC : 'app',
  SRC_FILES: 'app/**/*',
  ENTRY_POINT: './app/scripts/app.js',
  HTML: 'app/index.html',
  SCSS: 'app/styles/*.scss',
  STYLES : 'app/styles',
  FONTS : 'app/fonts/*',
  SCRIPTS : 'app/scripts/**/*.js',
  IMAGES : 'app/images/**/*',
  PARTIALS: 'app/partials/*',
  BOWER_ALL: 'app/bower_components/**/*',
  BOWER_MIN: 'app/bower_components/**/angular*.min.js'
}
var destPath = {
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  BUILD: 'dist/build',
  DEST_FILES : 'dist/**/*',
  HTML: 'dist/index.html',
  FONTS : 'dist/fonts',
  STYLES : 'dist/styles',
  SCRIPTS : 'dist/scripts',
  IMAGES : 'dist/images',
  PARTIALS: 'dist/partials',
  BOWER: 'dist/bower_components',
  ANGULAR_MIN_BUNDLE: 'dist/bower_components/angular_bundle.min.js',
  SCRIPT_MIN_BUNDLE: 'dist/scripts/bundle.min.js',
  STYLE_MIN_BUNDLE: 'dist/styles/bundle.min.css'
}

gulp.task('webserver', function() {
  connect.server({
  	root: './dist',
  	port:8888,
  	livereload: true,
		middleware: function (connect, opt) {
				var proxyOptions = url.parse('http://localhost:3000/');
				proxyOptions.route = '/proxy';
	      var proxy = new Proxy(proxyOptions);
	      return [proxy];
	  }
  });
});
 

//html
gulp.task('html', function() {
  return gulp.src(srcPath.HTML)
             .pipe(gulp.dest(destPath.DEST))
             // .pipe(notify({ message: 'Html task complete' }))
});
gulp.task('partials', function() {
  var combined = combiner.obj([
    gulp.src(srcPath.PARTIALS),
    jade({pretty: true}),
    gulp.dest(destPath.PARTIALS),
    // notify({ message: 'Partials task complete' }),
  ])
  combined.on('error', console.error.bind(console));
  return combined;

});

//Fonts
gulp.task('fonts', function() {
  return gulp.src(srcPath.FONTS)
             .pipe(gulp.dest(destPath.FONTS))
             // .pipe(notify({ message: 'Fonts task complete' }))
});
// Styles
gulp.task('styles', function() {
  var combined = combiner.obj([
	       gulp.src(srcPath.SCSS),
				  sourcemaps.init(),
   			  sass(),
		      autoprefixer('last 2 version'),
          concat('bundle.css'),
		      gulp.dest(destPath.STYLES),
		      rename({ suffix: '.min' }),
		      minifycss(),
   			  sourcemaps.write('./maps'),
		      gulp.dest(destPath.STYLES),
		      // notify({ message: 'Styles task complete' })
  ])
  combined.on('error', console.error.bind(console));
  return combined;
		    // .pipe(connect.reload());
});

 
// Scripts
gulp.task('scripts', function() {
  var combined = combiner.obj([
    gulp.src(srcPath.SCRIPTS),
    jshint('.jshintrc'),
    jshint.reporter('default'),
    gulp.dest(destPath.SCRIPTS),
    concat('bundle.js'),
    gulp.dest(destPath.SCRIPTS),
    rename({ suffix: '.min' }),
    uglify(),
    gulp.dest(destPath.SCRIPTS),
    // notify({ message: 'Scripts task complete' })
  ]);
  combined.on('error', console.error.bind(console));
  // combined.on('error', function(){console.log('error in uglify !!!!!!')});
  return combined;
});
gulp.task('bower_all', function() {
    return gulp.src(srcPath.BOWER_ALL)
          .pipe(gulp.dest(destPath.BOWER))
          // .pipe(notify({ message: 'Bower task complete' }));
});
gulp.task('bower_min', function() {
    return gulp.src(srcPath.BOWER_MIN)
          .pipe(concat('angular_bundle.js'))
          .pipe(rename({ suffix: '.min' }))
          .pipe(gulp.dest(destPath.BOWER))
          // .pipe(notify({ message: 'Bower_min task complete' }));
});
gulp.task('bower', ['bower_all', 'bower_min'])
// Images
gulp.task('images', function() {
  return gulp.src(srcPath.IMAGES)
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(destPath.IMAGES))
        // .pipe(notify({ message: 'Images task complete' }))
    // .pipe(connect.reload());
});

// Clean
gulp.task('clean', function() {
  return del(destPath.DEST_FILES);
});



// Watch
gulp.task('watch', function() {

  


  gulp.watch(srcPath.HTML, ['html']);
  gulp.watch(srcPath.PARTIALS, ['partials']);
  // Watch .scss files
  gulp.watch(srcPath.SCSS, ['styles']);

  // Watch .js files
  gulp.watch(srcPath.SCRIPTS, ['scripts']);

  // Watch image files
  gulp.watch(srcPath.IMAGES, ['images']);
  // watch(destPath.DEST_FILES).pipe(connect.reload());
  watch(srcPath.SRC_FILES).pipe(connect.reload());
});



gulp.task('replaceHTML', function(){
  return gulp.src(srcPath.HTML)
        .pipe(htmlreplace({
          


          'js': ['bower_components/angular_bundle.min.js','scripts/bundle.min.js'],
          'css': 'styles/bundle.min.css'
        }))
        .pipe(gulp.dest(destPath.DEST));
});
// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('styles', 'bower', 'images','fonts', 'html', 'scripts', 'partials', 'webserver','watch'); //, 'scripts'
});
gulp.task('deploy',['styles', 'bower', 'images','fonts', 'scripts', 'partials', 'replaceHTML']);
