(function (angular, app) {
    'use strict';
    angular.module('app.explore').controller('ExploreCtrl', function ($scope, $http) {
        $http.get('http://api.regenesis.pudo.org/model').success(function(data) {
            $scope.apiModel = data;
        });
        $http.get('/data/measuresDef.json').success(function (data) {
            $scope.measureDefs = data;
        });

        $scope.cubeFilter = {
            topic: null,
            level: null
        };
        $scope.cubeConfig = {
            year: null,
            measure: null
        };
        $scope.cube = {
            data: null
        };
        $scope.viewFilter = {
            rs: null
        };
    });
})(angular, app);