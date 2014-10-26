var app = {};
(function (angular) {
    'use strict';
    angular.module('app.explore', []);
    angular.module('app', ['ngRoute', 'angular-loading-bar', 'app.explore']).config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                controller: 'ExploreCtrl',
                templateUrl: 'partials/explore.html'
            });
    });
})(angular);