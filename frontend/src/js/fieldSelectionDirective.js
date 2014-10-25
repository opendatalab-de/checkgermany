(function (angular, app) {
    'use strict';

    angular.module('app.explore').directive('fieldSelection', function () {
        return {
            restrict: 'E',
            templateUrl: '/partials/fieldSelection.html',
            replace: true,
            link: function (scope) {
                scope.selectField = function (field) {
                    scope.selection.field = field;
                }
            }
        };
    });
})(angular, app);