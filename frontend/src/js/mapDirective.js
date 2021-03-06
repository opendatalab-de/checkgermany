(function (angular, app) {
    'use strict';

    var colors = {
        red: ["#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
        green: ["#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
        blue: ["#DEEBF7", "#C6DBEF", "#9ECAE1", "#6BAED6", "#4292C6", "#2171B5", "#08519C", "#08306B"],
        orange: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"],
        germany: ["#ffdf90", "#ffc32d", "#ff6600", "#ff2f01", "#c10100", "#8d0001", "#520000", "#24000b"]
    };

    var safeLog10 = function (number) {
        return number === 0 ? 0 : Math.log(Math.abs(number)) / Math.LN10;
    };

    var map = {
        leafletMap: null,
        areaLayer: null,
        areaLayerMap: {},
        numberFormatter: null,
        init: function () {
            this.leafletMap = L.map('map', {
                center: [50.665691, 10.451526],
                zoom: 7,
                minZoom: 5,
                maxZoom: 12
            });

            this.createInfoControl();
            this.addTileLayer();
        },
        createInfoControl: function () {
            this.info = L.control();

            this.info.onAdd = function (map) {
                this._div = L.DomUtil.create('div', 'info');
                this.update();
                return this._div;
            };

            this.info.update = function (layer) {
                var content = "";
                if (layer && layer.properties) {
                    var valueLabel = 'Wert';
                    content = '<b>' + layer.properties.GEN + ' (' + layer.properties.DES + ')</b><br>RS: ' + layer.properties.RS;
                    if (valueLabel && layer.cellValue) {
                        var formattedValue = map.numberFormatter(layer.cellValue, 4);
                        if (formattedValue.indexOf(',0000') > 0) {
                            formattedValue = formattedValue.substr(0, formattedValue.length - 5);
                        }
                        content += '<br>' + valueLabel + ': ' + formattedValue
                    }
                } else {
                    content = 'Mit der Maus auswählen';
                }
                this._div.innerHTML = content;
            };

            this.info.addTo(this.leafletMap);
        },
        addTileLayer: function () {
            var attribution = '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>';
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/pascalgabriel.k28h1mih/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        },
        addAreaLayer: function (level, onSuccess) {
            var that = map;
            if (!level || (that.areaLayer && that.areaLayer.level == level)) return true;

            if (that.areaLayer) {
                that.leafletMap.removeLayer(that.areaLayer.layer);
                that.areaLayer = null;
                that.areaLayerMap = {};
            }

            var customLayer = L.geoJson(null, {
                style: {
                    'opacity': 0.7,
                    'weight': 1,
                    'color': '#AAA'
                },
                onEachFeature: function (feature, layer) {
                    var rs = feature.properties['RS'];
                    if (rs.length > 10) {
                        rs = rs.substr(0, 5) + rs.substr(9, 3)
                    }
                    that.areaLayerMap[rs] = {
                        'layer': layer,
                        'cell': null,
                        'properties': feature.properties
                    };

                    layer.on("mouseover", function (e) {
                        that.info.update(that.areaLayerMap[rs]);
                    });

                    layer.on("mouseout", function (e) {
                        that.info.update();
                    });
                }
            });
            var layer = omnivore.topojson('/data/' + level.topoJsonId + '_sim200.json', null, customLayer);
            layer.addTo(that.leafletMap);

            that.areaLayer = {
                'level': level,
                'layer': layer
            };

            onSuccess();
        },
        addData: function (data, cubeConfig, cubeFilter) {
            var that = map;
            if (!data || !cubeConfig.measure) {
                return true;
            }

            var calculateCellValue = function (cell, properties) {
                var cellValue = cell[cubeConfig.measure.ref + '_sum'];
                if (cubeConfig.relation) {
                    var relationValue = 0;
                    cubeConfig.relation.fieldIds.forEach(function (fieldId) {
                        relationValue += properties[fieldId];
                    });
                    return relationValue > 0 ? Math.round(cellValue / relationValue * 10000) / 10000 : null;
                } else {
                    return cellValue;
                }
            };

            Object.keys(that.areaLayerMap).forEach(function (key) {
                that.areaLayerMap[key].cell = null;
                that.areaLayerMap[key].layer.setStyle({
                    'fillOpacity': 0.65,
                    'fillColor': '#EEE'
                });
            });

            data.cells.forEach(function (cell) {
                var layer = that.areaLayerMap[cell[cubeFilter.level.cubeDimension + '.name']];
                if (layer) {
                    layer.cell = cell;
                }
            });

            // determine max & min and reset colors;
            var max = 0;
            var min = 10000000;
            Object.keys(that.areaLayerMap).forEach(function (key) {
                if (that.areaLayerMap[key].cell) {
                    var value = calculateCellValue(that.areaLayerMap[key].cell, that.areaLayerMap[key].properties);
                    if (value !== null) {
                        if (value > max) {
                            max = value;
                        }
                        if (value < min && value > 0) {
                            min = value;
                        }
                    }
                }
            });
            var log10Boundary = [safeLog10(max), safeLog10(min)];

            Object.keys(that.areaLayerMap).forEach(function (key) {
                var layer = that.areaLayerMap[key];
                if (layer && layer.cell) {
                    var value = calculateCellValue(layer.cell, layer.properties);
                    layer.cellValue = value;
                    if (value !== null) {
                        // determine color
                        var color;
                        if (value == 0) {
                            color = '#EEE';
                        } else {
                            var colorScheme = (value <= 0) ? colors.orange : colors.germany;
                            var factor;
                            if (log10Boundary[0] === log10Boundary[1]) {
                                factor = 1;
                            }
                            else {
                                factor = Math.round((safeLog10(value) - log10Boundary[1]) / (log10Boundary[0] - log10Boundary[1]) * 100) / 100;
                            }
                            var colorIndex = Math.max(0, Math.round((colorScheme.length - 1) * factor));
                            color = colorScheme[colorIndex];
                        }

                        layer.layer.setStyle({
                            'fillOpacity': 0.65,
                            'fillColor': color
                        });
                    }
                }
            });
        }
    };

    angular.module('app.explore').directive('map', function ($http, $filter, $q) {
        return {
            restrict: 'E',
            template: '<div id="map"></div>',
            replace: true,
            link: function (scope, element) {
                map.numberFormatter = $filter('number');
                map.init();
                var areaPromise = null, dataPromise = null;

                var updateAreas = function () {
                    if (scope.styleOptions.form !== 'map') return false;
                    areaPromise = $q(function (resolve, reject) {
                        map.addAreaLayer(scope.cubeFilter.level, resolve);
                    });
                    return areaPromise;
                };

                var updateData = function () {
                    if (scope.styleOptions.form !== 'map') return false;
                    var deferred = $q.defer();
                    var i = 0;
                    setTimeout(function () {
                        i++;
                        if (areaPromise != null) {
                            areaPromise.then(function () {
                                map.addData(scope.cube.data, scope.cubeConfig, scope.cubeFilter);
                            });
                            deferred.resolve();
                        }
                        if (i > 5) {
                            deferred.reject();
                        }
                    }, 200);
                    return deferred.promise;
                };

                var update = function () {
                    if (scope.styleOptions.form !== 'map') return false;
                    updateAreas();
                    updateData();
                };

                scope.$watch('styleOptions.form', update);
                scope.$watch('cubeFilter.level', updateAreas);
                scope.$watch('cube.data', updateData);
                scope.$watch('cubeConfig.relation', updateData);
            }
        };
    });
})(angular, app);