(function (angular, app) {
    'use strict';

    angular.module('app.explore').directive('cartogram', function ($http) {
        return {
            restrict: 'E',
            template: '<svg class="cartogram"></svg>',
            replace: true,
            link: function (scope, element) {
                var cartogram = new app.cartogram(element[0]);
                var areasProperties = {};

                var updateAreas = function (onSuccess) {
                    if (scope.styleOptions.form !== 'bubbles') return false;
                    if (!scope.cubeFilter.level) return true;
                    $http.get('/data/' + scope.cubeFilter.level.topoJsonId + '_sim200.json').success(function (areas) {
                        cartogram.updateAreas(areas);
                        var geometries = areas.objects[Object.keys(areas.objects)[0]].geometries;
                        geometries.forEach(function (area) {
                            var rs = area.properties['RS'];
                            if (rs.length > 10) {
                                rs = rs.substr(0, 5) + rs.substr(9, 3)
                            }
                            areasProperties[rs] = area.properties;
                        });
                        if (onSuccess) {
                            onSuccess();
                        }
                    });
                };

                var updateData = function () {
                    if (scope.styleOptions.form !== 'bubbles') return false;
                    if (!scope.cube.data) return false;
                    var areaKeyValueMap = {};

                    scope.cube.data.cells.forEach(function (cell) {
                        var rs = cell[scope.cubeFilter.level.cubeDimension + '.name'];
                        var areaProperties = areasProperties[rs];
                        var cellValue = cell[scope.cubeConfig.measure.ref + '_sum'];
                        if (scope.cubeConfig.relation) {
                            console.log(areaProperties);
                            if (areaProperties) {
                                var relationValue = 0;
                                scope.cubeConfig.relation.fieldIds.forEach(function (fieldId) {
                                    relationValue += areaProperties[fieldId];
                                });
                                cellValue = relationValue > 0 ? Math.round(cellValue / relationValue * 10000) / 10000 : null;
                            } else {
                                cellValue = null;
                            }
                        }
                        areaKeyValueMap[rs] = cellValue;
                    });

                    cartogram.updateData(areaKeyValueMap);
                };

                var update = function () {
                    if (scope.styleOptions.form !== 'bubbles') return false;
                    updateAreas(updateData);
                };

                scope.$watch('styleOptions.form', update);
                scope.$watch('cubeFilter.level', function () {
                    updateAreas();
                });
                scope.$watch('cube.data', updateData);
                scope.$watch('cubeConfig.relation', updateData);
            }
        };
    });
})(angular, app);