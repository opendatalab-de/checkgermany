(function (angular, app) {
    'use strict';

    angular.module('app.explore').directive('map', function ($http) {
        return {
            restrict: 'E',
            template: '<svg style="height:960px;width:960px;"></svg>',
            replace: true,
            link: function (scope, element) {
                var landkreise, data, svg, bubble, diameter, format, color;

                var renderViz = function (fieldName) {
                    var node = svg.selectAll(".node")
                        .data(bubble.nodes(classes(data))
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
                        })

                    node.select("text")
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
                            if (currentLandkreis && currentLandkreis.AGS.indexOf('08') === 0) {
                                childrenList.push({
                                    className: kreis['kreise.label'],
                                    packageName: kreis['kreise.label'],
                                    value: kreis[fieldName]
                                });
                            }
                        });
                        return { children: childrenList };
                    }
                };

                $http.get('/data/landkreise.json').success(function (_landkreise) {
                    landkreise = _landkreise;
                    $http.get('/data/example.json').success(function (_data) {
                        data = _data;

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
                    });
                });

                scope.$watch('fieldObj.name', function (fieldObj) {
                    if (svg && fieldObj) {
                        renderViz(fieldObj);
                    }
                });
            }
        };
    });
})(angular, app);