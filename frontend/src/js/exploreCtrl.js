(function (angular, app) {
    'use strict';
    angular.module('app.explore').controller('ExploreCtrl', function ($scope, $http) {
        $http.get('http://api.regenesis.pudo.org/model').success(function(data) {
            $scope.apiModel = data;
        });

        $scope.cubeFilter = {
            topic: null,
            level: null
        };
        $scope.cube = {
            def: null,
            filter: [],
            measure: null
        };
        $scope.viewFilter = {
            rs: null
        };
    });
})(angular, app);