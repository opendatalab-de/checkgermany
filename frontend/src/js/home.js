(function (angular, app) {
    'use strict';
    var homeModule = angular.module('app.home', []);
    homeModule.controller('HomeCtrl', function ($scope) {
        $scope.greet = function() {
            $scope.greeting = 'Hallo!';
        };
    });
})(angular, app);