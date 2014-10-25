var app = {};
(function (angular) {
    'use strict';
    angular.module('app', ['ngRoute', 'app.home']).config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                controller: 'HomeCtrl',
                templateUrl: 'partials/home.html'
            });
    });
})(angular);