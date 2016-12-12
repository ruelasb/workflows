var gulp = require('gulp');
var	gutil = require('gulp-util');//used to log stuff to terminal
var coffee = require('gulp-coffee');//used to turn coffee files into .js files
var browserify = require('gulp-browserify');//gets all require variables and pulls all libraries
var compass = require('gulp-compass');//gets all @import files and concat to css
var concat = require('gulp-concat');//concatinates all files in order of object/array
var connect = require('gulp-connect');

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];

var sassSources = ['components/sass/style.scss'];

var htmlSources = ['builds/development/*.html'];
var jsonSources = ['builds/development/js/*.json'];

gulp.task('coffee', function(){//this task gets .coffee file and converts it into .js file in the scripts folder
	gulp.src(coffeeSources)
	.pipe(coffee({ bare: true })
		.on('error', gutil.log))
	.pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){//goes into the scripts forlder and "spits" out everything into one file
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify()) //looks through all thre requies and gets code from libraries
	.pipe(gulp.dest('builds/development/js'))
	.pipe(connect.reload())
});

gulp.task('compass', function(){//gets all the sass files and converts them to css and puts them into one file
	gulp.src(sassSources)
	.pipe(compass({
      sass: 'components/sass',
      images: 'builds/development/images',
      style: 'expanded'
    	}))
		.on('error', gutil.log)
	.pipe(gulp.dest('builds/development/css'))
	.pipe(connect.reload())
});

gulp.task('connect', function(){
	connect.server({
		root: 'builds/development/',
    	livereload: true
	});
});


gulp.task('watch',function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']); 
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch(htmlSources, ['html']);
	gulp.watch(jsonSources, ['json']);
});

gulp.task('html', function(){
	gulp.src(htmlSources)
	.pipe(connect.reload())
});

gulp.task('json', function(){
	gulp.src(jsonSources)
	.pipe(connect.reload())
})


gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect','watch']);