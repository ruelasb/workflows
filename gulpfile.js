var gulp = require('gulp');
var	gutil = require('gulp-util');//used to log stuff to terminal
var coffee = require('gulp-coffee');//used to turn coffee files into .js files
var browserify = require('gulp-browserify');//gets all require variables and pulls all libraries
var compass = require('gulp-compass');//gets all @import files and concat to css
var concat = require('gulp-concat');//concatinates all files in order of object/array
var connect = require('gulp-connect');
var gulpif = require('gulp-if');//creates conditional tasks
var uglify = require('gulp-uglify');//js library to control how your code should be minified
var minifyHTML = require('gulp-htmlmin');//get html file from dev and place in production compressed and minified

var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
	'components/scripts/rclick.js',
	'components/scripts/pixgrid.js',
	'components/scripts/tagline.js',
	'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [ outputDir + '*.html'];
jsonSources = [ outputDir + 'js/*.json'];

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
	.pipe(gulpif(env === 'production', uglify()))
	.pipe(gulp.dest(outputDir + 'js'))
	.pipe(connect.reload())
});

gulp.task('compass', function(){//gets all the sass files and converts them to css and puts them into one file
	gulp.src(sassSources)
	.pipe(compass({
      sass: 'components/sass',
      images: outputDir + 'images',
      style: sassStyle
    	}))
		.on('error', gutil.log)
	.pipe(gulp.dest(outputDir + 'css'))
	.pipe(connect.reload())
});

gulp.task('connect', function(){
	connect.server({
		root: outputDir,
    	livereload: true
	});
});


gulp.task('watch',function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']); 
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch(jsonSources, ['json']);
});

gulp.task('html', function(){
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env==='production', minifyHTML({collapseWhitespace: true})))
	.pipe(gulpif(env==='production', gulp.dest(outputDir)))
	.pipe(connect.reload())
});

gulp.task('json', function(){
	gulp.src(jsonSources)
	.pipe(connect.reload())
})


gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect','watch']);