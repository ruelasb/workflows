var gulp = require('gulp');
var	gutil = require('gulp-util');//used to log stuff to terminal
var coffee = require('gulp-coffee');//used to turn coffee files into .js files
var browserify = require('gulp-browserify');//gets all require variables and pulls all libraries
var compass = require('gulp-compass');//gets all @import files and concat to css
var concat = require('gulp-concat');//concatinates all files in order of object/array

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];

var sassSources = ['components/sass/style.scss'];

gulp.task('coffee', function(){
	gulp.src(coffeeSources)
	.pipe(coffee({ bare: true })
		.on('error', gutil.log))
	.pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify()) //looks through all thre requies and gets code from libraries
	.pipe(gulp.dest('builds/development/js'))
});

gulp.task('compass', function(){
	gulp.src(sassSources)
	.pipe(compass({
      sass: 'components/sass',
      images: 'builds/development/images',
      style: 'expanded'
    	}))
		.on('error', gutil.log)
	.pipe(gulp.dest('builds/development/css'))
});

gulp.task('default',['coffee', 'js', 'compass']);