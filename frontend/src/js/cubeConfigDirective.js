(function (angular, app) {
    'use strict';

    var findMatchingCubes = function (cubeFilter, apiModel) {
        if (!cubeFilter.topic || !cubeFilter.level || !apiModel) return [];
        return apiModel.cubes.filter(function (cube) {
            return cube.name.substr(0, 5) === cubeFilter.topic.code && cube.dimensions.indexOf(cubeFilter.level.cubeDimension) >= 0 && cube.dimensions.indexOf('stag') < 0 && cube.dimensions.indexOf('jahr') >= 0;
        });
    };

    var extractMeasures = function (cubes, measureDefs) {
        if (!measureDefs) return [];
        var measures = [];
        cubes.forEach(function (cube) {
            cube.measures.forEach(function (measure) {
                var matchingMeasures = measures.filter(function (_measure) {
                    return _measure.ref == measure.ref;
                });
                if (matchingMeasures.length < 1) {
                    var matchingDefs = measureDefs.filter(function (cMeasureDef) {
                        return cMeasureDef.code == measure.ref;
                    });
                    var matchingDef = matchingDefs.length > 0 ? matchingDefs[0] : {};

                    measures.push({
                        ref: measure.ref,
                        label: matchingDef.label
                    });
                }
            })
        });
        return measures;
    };

    var fillAvailableYears = function (years, cubes, $http, onSuccess) {
        var resolvedCubes = 0;
        var callOnSuccessWhenAllCubesAreResolved = function () {
            if (resolvedCubes === cubes.length) {
                onSuccess();
            }
        };

        cubes.forEach(function (cube) {
            $http.get('http://api.regenesis.pudo.org/cube/' + cube.name + '/aggregate?drilldown=jahr%3Ajahr').success(function (data) {
                if (!data || !data.cells) return false;
                data.cells.forEach(function (cell) {
                    var yearLabel = cell['jahr.text'];
                    var matchingYears = years.filter(function (year) {
                        return year.label === yearLabel;
                    });
                    var matchingYear = matchingYears.length > 0 ? matchingYears[0] : null;
                    if (!matchingYear) {
                        matchingYear = {
                            label: yearLabel,
                            cubes: []
                        };
                        years.push(matchingYear);
                    }
                    matchingYear.cubes.push(cube);
                });
                resolvedCubes++;
                callOnSuccessWhenAllCubesAreResolved();
            });
        })
    };

    var fillCubeData = function (cubeHolder, cubeConfig, cubeFilter, $http) {
        if (!cubeConfig.year || !cubeConfig.measure || !cubeFilter.level) {
            cubeHolder.data = null;
            return null;
        }
        var matchingCubes = cubeConfig.year.cubes.filter(function (cube) {
            var matchingMeasures = cube.measures.filter(function (measure) {
                return measure.ref === cubeConfig.measure.ref;
            });
            return matchingMeasures.length > 0;
        });
        var matchingCube = matchingCubes.length > 0 ? matchingCubes[0] : null;
        if (matchingCube) {
            $http.get('http://api.regenesis.pudo.org/cube/' + matchingCube.name + '/aggregate?cut=jahr.text:' + cubeConfig.year.label + '&drilldown=' + cubeFilter.level.cubeDimension).success(function (data) {
                cubeHolder.data = data;
            });
        }
    };

    angular.module('app.explore').directive('cubeConfig', function ($http) {
        return {
            restrict: 'E',
            templateUrl: '/partials/cubeConfig.html',
            replace: true,
            link: function (scope) {
                var update = function () {
                    if (!scope.cubeFilter || !scope.measureDefs) return true;
                    scope.cubes = findMatchingCubes(scope.cubeFilter, scope.apiModel);
                    scope.measures = extractMeasures(scope.cubes, scope.measureDefs);
                    scope.years = [];
                    fillAvailableYears(scope.years, scope.cubes, $http, function () {
                        scope.years.sort(function (a, b) {
                            return parseInt(b.label, 10) - parseInt(a.label, 10);
                        });
                        scope.cubeConfig.year = scope.years[0];
                    });
                    scope.cubeConfig.measure = scope.measures.length > 0 ? scope.measures[0] : null;
                };

                scope.$watch('cubeFilter', update, true);
                scope.$watch('measuresDef', update);

                scope.$watch('cubeConfig', function (cubeConfig) {
                    fillCubeData(scope.cube, cubeConfig, scope.cubeFilter, $http);
                }, true);
            }
        };
    });
})(angular, app);