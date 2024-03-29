/**
 * Created by tykayn on 14/05/15.
 */
// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'dist/bower_components/jquery/dist/jquery.min.js',
            'dist/bower_components/angularjs/angular.js',
            'dist/bower_components/angular-mocks/angular-mocks.js',
            'dist/js/lib/ng-drag-n-drop.js',
            'dist/js/app.js',
            'dist/js/services/IA.js',
            'dist/js/main.js',
            'src/tests/spec/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8085,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        //  browsers: ['PhantomJS','/usr/bin/google-chrome','Firefox'],
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};