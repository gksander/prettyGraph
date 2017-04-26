var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

// INITIALIZE BROWSERSYNC
browserSync.init({
	server: './'
});

// Declare some variables for use in tasks.
// THIS ORDER MATTERS -- BASED ON HOW EVENT LISTENERS ARE REGISTERED.
var scripts = ['js/PG.js', 'js/main.js', 'js/listeners.js'];

/* 
	Default task. Watches for file changes and runs appropriate tasks.
*/
gulp.task('default', ['styles'] ,function() {
  // Watch for style changes
  gulp.watch('styles/**/*.scss', ['styles']);

  // Watch for script changes
  gulp.watch(scripts, ['js']);

  // Watch for general changes.
  gulp.watch('./*').on('change', browserSync.reload);
});

// Task to compile .scss files
gulp.task('styles', function(){
	// Compile styles
	gulp.src('styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./styles'))
		.pipe(browserSync.stream());
});

// Task to compile JS files
gulp.task('js', function(){
	gulp.src(scripts)
	.pipe(concat('main-dist.js'))
	.pipe(gulp.dest('js'))
	// .pipe(uglify().on('error', gulpUtil.log))
	.pipe(browserSync.stream());
});

// gulp.task('lint', function(){
// 	return gulp.src(scripts)
// 				.pipe(eslint())
// 				.pipe(eslint.format())
// 				.pipe(eslint.failOnError());
// })