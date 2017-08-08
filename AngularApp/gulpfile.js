"use strict";

var gulp = require('gulp');
var gutil = require("gulp-util");
var runSequence = require('run-sequence');
var del = require('del');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var config = require('./gulp.config')();
var tscConfig = require('./tsconfig.json');
var fileExists = require('file-exists');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');

var webpackStream = require('webpack-stream');
var webpackProdConfig = require('./config/webpack.production');



/**
 * Remove build directory.
 */
gulp.task('clean', function (cb)  {
    return del(["dist"], cb);
});

gulp.task('sass',['copy:assets'], function () {
    var processors = [
        autoprefixer({ browsers: ["last 3 versions"] }),
        cssnano
    ];
    // Need to add something to handle incorporating our CSS from , 'src/node_modules/primeui/themes/bootstrap/theme.css'
    //  which is currently just copied manually into the deploy/assets/stylesheets directory
    return gulp.src('src/assets/stylesheets/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./deploy/assets/stylesheets'))
        ;
});

// copy static assets - i.e. non TypeScript/scss compiled source
gulp.task('copy:assets', function () {
    return gulp.src(['src/assets/**', '!src/**/*.ts', '!src/**/*.scss',  '!src/**/*.html',  '!src/**/*.js'], {base: './src/assets'})
        .pipe(gulp.dest('./deploy/assets'))
        ;
});

gulp.task("start-server", ['sass'],  function(callback) {
    return nodemon({
        script: 'server.js',
        ignore: ['deploy/', 'src/', 'dist/']
    });
});

gulp.task("start-server-wizard", ['sass'],  function(callback) {
    return nodemon({
        script: 'server-wizard.js',
        ignore: ['deploy/', 'src/', 'dist/']
    });
});


gulp.task('app-config', function() {
    if (!fileExists('src/app.config.ts')) {
        return gulp.src('app.config-example.ts')
            .pipe(rename('app.config.ts'))
            .pipe(gulp.dest('src'));
    }
});

gulp.task('build', ['clean'], function(cb) {
    gulp.src('src/member_main.ts')
        .pipe(webpackStream( webpackProdConfig ))
        .pipe(gulp.dest('deploy'));
    return runSequence('sass', cb);
});

gulp.task('default', ['start-server']);
