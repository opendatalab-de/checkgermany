(function (angular, app) {
    'use strict';

    var areas = [
        {
            label: 'Landkreis Heilbronn',
            rs: '0010114'
        },
        {
            label: 'Stadt Heilbronn',
            rs: '0010115'
        }
    ];

    angular.module('app.explore').directive('areaSelection', function () {
        return {
            restrict: 'E',
            templateUrl: '/partials/areaSelection.html',
            replace: true,
            link: function (scope) {
                scope.areas = areas;
                scope.selectArea = function (area) {
                    scope.selection.area = area;
                }
            }
        };
    });
})(angular, app);