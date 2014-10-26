(function (angular, app) {
    'use strict';

    var levelCubeDimensions = ['gemein', 'kreise', 'dland'];
    var levels = [
        {
            label: 'Gemeinden',
            cubeDimension: 'gemein'
        },
        {
            label: 'Stadt- und Landkreise',
            cubeDimension: 'kreise'
        },
        {
            label: 'Bundesländer',
            cubeDimension: 'dland'
        }
    ];

    var determineAvailableLevels = function (topic, apiModel) {
        if (!topic || !apiModel) return [];

        var cubes = apiModel.cubes.filter(function (cube) {
            return cube.name.substr(0, 5) === topic.code;
        });

        var availableLevelCubeDimensions = [];
        cubes.forEach(function (cube) {
            cube.dimensions.forEach(function (dimension) {
                if (levelCubeDimensions.indexOf(dimension) >= 0 && availableLevelCubeDimensions.indexOf(dimension) < 0) {
                    availableLevelCubeDimensions.push(dimension);
                }
            });
        });

        var availableLevels = levels.filter(function (level) {
            return availableLevelCubeDimensions.indexOf(level.cubeDimension) >= 0;
        });
        return availableLevels;
    };

    angular.module('app.explore').directive('levelSelection', function () {
        return {
            restrict: 'E',
            templateUrl: '/partials/fieldSelection.html',
            replace: true,
            link: function (scope) {
                scope.$watch('cubeFilter.topic', function (topic) {
                    scope.levels = determineAvailableLevels(topic, scope.apiModel);
                });
            }
        };
    });
})(angular, app);