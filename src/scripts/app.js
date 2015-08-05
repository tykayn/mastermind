/**
 * Created by tykayn on 14/05/15.
 */
'use strict';
/** This is a description of the foo function. **/
angular.module('crossedWordsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
])
.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'html/tpl/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });