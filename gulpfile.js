'use strict';

var gulp = require('gulp');
var del = require('del');


var path = require('path');


// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream'),

    sourceFile = './client/app/scripts/app.js',

    destFolder = './public/scripts',
    destFileName = 'app.js';

var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Styles
gulp.task('styles', ['sass'  ]);

gulp.task('sass', function() {
    return gulp.src(['./client/app/styles/**/*.scss', './client/app/styles/**/*.css'])
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['./client/bower_components']
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('./public/styles'))
        .pipe($.size());
});

gulp.task('stylus', function() {
    return gulp.src(['./client/app/styles/**/*.styl'])
        .pipe($.stylus())
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('./public/styles'))
        .pipe($.size());
});


var bundler = watchify(browserify({
    entries: [sourceFile],
    debug: true,
    insertGlobals: true,
    cache: {},
    packageCache: {},
    fullPaths: true
}));

bundler.on('update', rebundle);
bundler.on('log', $.util.log);

function rebundle() {
    return bundler.bundle()
        // log errors if they happen
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source(destFileName))
        .pipe(gulp.dest(destFolder))
        .on('end', function() {
            reload();
        });
}

// Scripts
gulp.task('scripts', rebundle);

gulp.task('buildScripts', function() {
    return browserify(sourceFile)
        .bundle()
        .pipe(source(destFileName))
        .pipe(gulp.dest('./public/scripts'));
});




// HTML
gulp.task('html', function() {
    return gulp.src('./client/app/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('./public'))
        .pipe($.size());
});

// Images
gulp.task('images', function() {
    return gulp.src('./client/app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('./public/images'))
        .pipe($.size());
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src(require('main-bower-files')({
            filter: '**/*.{eot,svg,ttf,woff,woff2}'
        }).concat('./client/app/fonts/**/*'))
        .pipe(gulp.dest('./public/fonts'));
});

// Clean
gulp.task('clean', function(cb) {
    $.cache.clearAll();
    del(['./public/styles', './public/scripts'], cb);
});

// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function() {
    return gulp.src('./app/*.html')
        .pipe($.useref.assets())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('./public'));
});

gulp.task('buildBundle', ['styles', 'buildScripts', 'bower'], function() {
    return gulp.src('./app/*.html')
        .pipe($.useref.assets())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('./public'));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src('./client/bower_components/**/*.js', {
            base: './client/bower_components'
        })
        .pipe(gulp.dest('./public/bower_components/'));

});

gulp.task('json', function() {
    gulp.src('./client/app/scripts/json/**/*.json', {
            base: './client/app/scripts'
        })
        .pipe(gulp.dest('./public/scripts/'));
});

// Robots.txt and favicon.ico
gulp.task('extras', function() {
    return gulp.src(['./client/app/*.txt', './client/app/*.ico'])
        .pipe(gulp.dest('./public/'))
        .pipe($.size());
});

// Watch
gulp.task('watch', ['html', 'fonts', 'bundle'], function() {

    browserSync({
        notify: false,
        logPrefix: 'BS',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['./public', 'app']
    });

    // Watch .json files
    gulp.watch('./client/app/scripts/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('./client/app/*.html', ['html']);

    gulp.watch(['./client/app/styles/**/*.scss', './client/app/styles/**/*.css'], ['styles', reload]);

    

    // Watch image files
    gulp.watch('./client/app/images/**/*', reload);
});

// Build
gulp.task('build', ['html', 'buildBundle', 'images', 'fonts', 'extras'], function() {
    gulp.src('./public/scripts/app.js')
        .pipe($.uglify())
        .pipe($.stripDebug())
        .pipe(gulp.dest('./public/scripts'));
});

// Default task
gulp.task('default', ['clean', 'build'  ]);
