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
            measure: null,
            relation: null
        };
        $scope.styleOptions = {
            form: 'map'
        };
        $scope.cube = {
            data: null
        };
        $scope.viewFilter = {
            rs: null
        };

        $scope.showMap = function () {
            $scope.styleOptions.form = 'map';
        };
        $scope.showBubbles = function () {
            $scope.styleOptions.form = 'bubbles';
        };
    });
})(angular, app);