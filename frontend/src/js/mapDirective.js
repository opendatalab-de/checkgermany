(function (angular, app) {
    'use strict';

    angular.module('app.explore').directive('map', function ($http) {
        return {
            restrict: 'E',
            template: '<svg style="height:960px;width:960px;"></svg>',
            replace: true,
            link: function (scope, element) {
                $http.get('/data/landkreise.json').success(function (landkreise) {
                    $http.get('/data/example.json').success(function (data) {
                        var diameter = 960,
                            format = d3.format(",d"),
                            color = d3.scale.category20c();

                        var bubble = d3.layout.pack()
                            .sort(null)
                            .size([diameter, diameter])
                            .padding(1.5);

                        var svg = d3.select(element[0])
                            .attr("width", diameter)
                            .attr("height", diameter)
                            .attr("viewBox", "0 0 " + diameter + " " + diameter)
                            .attr("class", "bubble");

                        var node = svg.selectAll(".node")
                            .data(bubble.nodes(classes(data))
                                .filter(function (d) {
                                    return !d.children;
                                }));
                        node.exit().remove();
                        node.enter().append("g");
                        node
                            .attr("class", "node")
                            .attr("transform", function (d) {
                                return "translate(" + d.x + "," + d.y + ")";
                            });

                        node.append("title")
                            .text(function (d) {
                                return d.className + ": " + format(d.value);
                            });

                        node.append("circle")
                            .attr("r", function (d) {
                                return d.r;
                            })
                            .style("fill", function (d) {
                                return color(d.packageName);
                            });

                        node.append("text")
                            .attr("dy", ".3em")
                            .style("text-anchor", "middle")
                            .text(function (d) {
                                return d.className.substring(0, d.r / 3);
                            });

// Returns a flattened hierarchy containing all leaf nodes under the root.
                        function classes(root) {
                            var childrenList = [];
                            root.forEach(function (kreis) {
                                var currentLandkreise = landkreise.filter(function (landkreis) {
                                    return landkreis.AGS == kreis['kreise.name']
                                });
                                var currentLandkreis = currentLandkreise.length > 0 ? currentLandkreise[0] : null;
                                if (currentLandkreis) {
                                    childrenList.push({
                                        className: kreis['stenw5_sum'] + ' ' + currentLandkreis['Bevölkerung'] + ' ' + kreis['kreise.label'],
                                        packageName: kreis['kreise.label'],
                                        value: kreis['stenw5_sum'] / currentLandkreis['Bevölkerung']
                                    });
                                }
                            });
                            return { children: childrenList };
                        }
                    });
                })
            }
        };
    });
})(angular, app);