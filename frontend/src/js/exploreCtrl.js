(function (angular, app) {
    'use strict';
    angular.module('app.explore').controller('ExploreCtrl', function ($scope) {
        $scope.selection = {
            topic: null,
            field: null,
            areaCode: null
        };
        $scope.fieldObj = {
            name: 'stenw5_sum'
        };
    });
})(angular, app);