'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var importer = require('node-sass-globbing');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var cssmin = require('gulp-cssmin');
var uncss = require('gulp-uncss');
var stripCssComments = require('gulp-strip-css-comments');
var uglify = require('gulp-uglify');

var sass_config = {
  importer: importer,
  includePaths: [
    'node_modules/breakpoint-sass/stylesheets/',
    'node_modules/singularitygs/stylesheets/',
    'node_modules/modularscale-sass/stylesheets/',
    'node_modules/singularity-extras/stylesheets/',
    'node_modules/compass-mixins/lib/'
  ]
};

gulp.task('uglify', function() {
  return gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('js_min'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        injectChanges: true,
        proxy: "127.0.0.1/singularitygs_extras"
    });
    gulp.watch("./sass/**/*.scss", ['sass', /*'clearcache'*/]).on('change', browserSync.reload);
    gulp.watch("./js/**/*.js", ['uglify']).on('change', browserSync.reload);
    gulp.watch("index.html").on('change', browserSync.reload);
});

gulp.task('sass', function () {
  gulp.src('./sass/**/*.scss')
    .pipe(plumber())
    //.pipe(sourcemaps.init())
    .pipe(sass(sass_config).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version']
    }))
    //.pipe(sourcemaps.write('.'))
    .pipe(stripCssComments({preserve: false}))
    .pipe(gulp.dest('./css'))
    // .pipe(uncss({
    //       html: ['./html/**/*.html']
    //   }))
    //.pipe(cssmin())
    .pipe(gulp.dest('./css'));
});

gulp.task('default', ['sass', 'uglify', 'browser-sync']);