(function (angular, app) {
    'use strict';
    angular.module('app.explore').controller('ExploreCtrl', function ($scope) {
        $scope.selection = {
            topic: null,
            field: null,
            year: null,
            areaCode: null
        };
    });
})(angular, app);