/**
 * Created by tykayn on 14/05/15.
 */

var gulp = require("gulp"),
    plugins = require('gulp-load-plugins')(),
    options = require("minimist")(process.argv.slice(2)),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    karma = require('karma').server,
    documentation = require('documentation');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

// paths
var testFiles = [
    'dist/js/main.js'
];

var sources = {
    tests: "src/tests/*.js",
    sass: "src/sass/*.scss",
    html: "src/html/*.html",
    htmls: "src/html/**/*.html",
    tests: "src/tests/**/*.js",
    js: "src/scripts/*.js",
    jsAll: "src/scripts/**/*.js",
    coffee: "src/coffee/*.coffee",
    coffees: "src/coffee/**/*.coffee"
};
var destinations = {
    sass: "dist/css/",
    html: "dist/",
    coffee: "dist/coffee/",
    js: "dist/js/",
    doc: "dist/doc/"
};

gulp.task("html", function () {
    console.log("html was changed");
    gulp.src([sources.html, sources.htmls])
        .pipe(gulp.dest(destinations.html))
        .pipe(reload({stream: true}));
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    plugins.karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});
gulp.task('cover', function (done) {
    console.log('destinations',destinations.js+'main.js');
    gulp.src([sources.jsAll, destinations.js+'main.js'])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function () {
            gulp.src([sources.tests])
                .pipe(mocha())
                .pipe(istanbul.writeReports()) // Creating the reports after tests runned
                .pipe(istanbul.enforceThresholds({thresholds: {global: 20}})) // Enforce a coverage of at least 90%
                .on('end', done);
        });
});


/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});
gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma-once.conf.js'
    }, done);
});

gulp.task("styles", function () {
    gulp.src("./src/css/*.css")
        .pipe(options.production ? gulpLoadPlugins.plumber() : plugins.gutil.noop())
        .pipe(plugins.myth({sourcemap: !options.production}))
        .pipe(options.production ? csso() : plugins.gutil.noop())
        .pipe(gulp.dest("./dist/css/"));
});
gulp.task("hello", function () {
    console.log("hello le monde!");
});
gulp.task('browser-sync', function () {
    return browserSync.init(null, {
        open: true,
        server: {
            baseDir: "./dist"
        }
    });
});
gulp.task("sass2css", function () {
    console.log("style was changed");
    gulp.src("./src/sass/*.scss")
        .pipe(plugins.sass({outputStyle: 'compressed', errLogToConsole: true}))
        .pipe(gulp.dest("./dist/css/"))
        .pipe(reload({stream: true}))
        .on('error', plugins.util.log);
});
gulp.task("coffee2js", function () {
    console.log("coffee was changed");
    gulp.src([sources.coffee, sources.coffees])
        .pipe(plugins.coffee({bare: true}))
        .pipe(plugins.plumber())
        .pipe(gulp.dest("./dist/js/"))
        .pipe(plugins.uglify())
        .pipe(reload({stream: true}));
    console.log("coffee was served");
});
gulp.task('watch', function () {
    gulp.watch(sources.tests, ['test']);
    gulp.watch(sources.sass, ['sass2css']);
    gulp.watch([sources.htmls, sources.html], ['html']);
    gulp.watch(sources.coffee, ['coffee2js', 'doc', 'test']);
    gulp.watch(sources.js, ['doc']);

});

gulp.task('lint', function () {
    gulp.src(sources.js)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});


gulp.task('doc', function () {
    gulp.src(sources.js)
        .pipe(plugins.jsdoc(destinations.doc + 'doc/main-documentation'))
        .pipe(reload({stream: true}));
});
gulp.task("default", ["coffee2js", "sass2css", "lint", "html", "browser-sync", "watch", "tdd"], function () {
    console.log("spartiiiii");
});
