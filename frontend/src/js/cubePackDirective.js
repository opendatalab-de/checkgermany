(function (angular, app) {
    'use strict';

    angular.module('app.explore').directive('cubePack', function ($http) {
        return {
            restrict: 'E',
            template: '<svg style="height:960px;width:960px;"></svg>',
            replace: true,
            link: function (scope, element) {
                var landkreise, data, svg, bubble, diameter, format, color;

                diameter = 960,
                    format = d3.format(",d"),
                    color = d3.scale.category20c();

                bubble = d3.layout.pack()
                    .sort(null)
                    .size([diameter, diameter])
                    .padding(1.5);

                svg = d3.select(element[0])
                    .attr("width", diameter)
                    .attr("height", diameter)
                    .attr("viewBox", "0 0 " + diameter + " " + diameter)
                    .attr("class", "bubble");

                var updateData = function () {
                    if (!scope.cube || !scope.cube.data || !scope.cube.data.cells) return false;

                    var node = svg.selectAll(".node")
                        .data(bubble.nodes(classes())
                            .filter(function (d) {
                                return !d.children;
                            }));
                    node.exit().remove();
                    var gEnter = node.enter().append("g").attr("class", "node");
                    node.transition().duration(2000)
                        .attr("transform", function (d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                    gEnter.append("title");
                    gEnter.append("circle");
                    gEnter.append("text").attr("dy", ".3em").style("text-anchor", "middle");

                    node.select("title")
                        .text(function (d) {
                            return d.className + ": " + format(d.value);
                        });

                    node.select("circle")
                        .style("fill", function (d) {
                            return color(d.packageName);
                        })
                        .transition().duration(2000)
                        .attr("r", function (d) {
                            return d.r;
                        });

                    node.select("text")
                        .text(function (d) {
                            return d.className.substring(0, d.r / 3);
                        });

// Returns a flattened hierarchy containing all leaf nodes under the root.
                    function classes() {
                        var childrenList = [];
                        scope.cube.data.cells.forEach(function (cell) {
                            childrenList.push({
                                className: cell[scope.cubeFilter.level.cubeDimension + '.label'],
                                packageName: cell[scope.cubeFilter.level.cubeDimension + '.label'],
                                value: cell[scope.cubeConfig.measure.ref + '_sum']
                            });
                        });
                        return { children: childrenList };
                    }
                };

                scope.$watch('cube.data', updateData);
                scope.$watch('cubeConfig.relation', updateData);
            }
        };
    });
})(angular, app);