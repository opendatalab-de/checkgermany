(function (angular, app) {
    'use strict';

    var colors = {
        red: ["#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
        green: ["#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
        blue: ["#DEEBF7", "#C6DBEF", "#9ECAE1", "#6BAED6", "#4292C6", "#2171B5", "#08519C", "#08306B"],
        orange: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"]
    };

    var safeLog10 = function(number) {
        return number === 0 ? 0 : Math.log(Math.abs(number)) / Math.LN10;
    };

    var map = {
        leafletMap: null,
        areaLayer: null,
        areaLayerMap: {},
        init: function () {
            this.leafletMap = L.map('map', {
                center: [51.165691, 10.451526],
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

            this.info.update = function (props) {
                this._div.innerHTML = (props ? '<b>' + props.GEN + ' (' + props.DES + ')</b><br>RS: ' + props.RS : 'Mit der Maus auswählen');
            };

            this.info.addTo(this.leafletMap);
        },
        addTileLayer: function () {
            var attribution = '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>';
            L.tileLayer('https://{s}.tiles.mapbox.com/v3/codeforheilbronn.i4fb354c/{z}/{x}/{y}.png', {
                'maxZoom': 18,
                'attribution': attribution
            }).addTo(this.leafletMap);
        },
        addAreaLayer: function (level, onSuccess) {
            var that = map;
            if(!level || (that.areaLayer && that.areaLayer.level == level)) return true;

            if(that.areaLayer) {
                that.leafletMap.removeLayer(that.areaLayer.layer);
                that.areaLayer = null;
                that.areaLayerMap = {};
            }

            var customLayer = L.geoJson(null, {
                style: {
                    'opacity': 0.5,
                    'weight': 1
                },
                onEachFeature: function (feature, layer) {
                    layer.on("mouseover", function (e) {
                        that.info.update(feature.properties);
                    });

                    layer.on("mouseout", function (e) {
                        that.info.update();
                    });

                    that.areaLayerMap[feature.properties['RS']] = layer;
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
        addData: function(data, cubeConfig, cubeFilter) {
            var that = map;
            if(!data || !cubeConfig.measure) {
                return true;
            }

            // determine max & min;
            var max = 0;
            var min = 10000000;
            data.cells.forEach(function(cell) {
                var value = cell[cubeConfig.measure + '_sum'];
                if (value > max) {
                    max = value;
                }
                if (value < min && value > 0) {
                    min = value;
                }
            });
            var log10Boundary = [safeLog10(max), safeLog10(min)];

            // reset
            Object.keys(that.areaLayerMap).forEach(function(key) {
                that.areaLayerMap[key].setStyle({
                    'fillOpacity': 0.65,
                    'fillColor': '#EEE'
                });
            });

            data.cells.forEach(function(cell) {
                var layer = that.areaLayerMap[cell[cubeFilter.level.cubeDimension + '.name']];
                if(layer) {
                    var value = cell[cubeConfig.measure + '_sum'];

                    // determine color
                    var color;
                    if (value == 0) {
                        color = '#EEE';
                    } else {
                        var colorScheme = (value <= 0) ? colors.orange : colors.blue;
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

                    layer.setStyle({
                        'fillOpacity': 0.65,
                        'fillColor': color
                    });
                }
            });
        }
    };

    angular.module('app.explore').directive('map', function ($http) {
        return {
            restrict: 'E',
            template: '<div id="map"></div>',
            replace: true,
            link: function (scope, element) {
                map.init();
                var areaLayerInitialized = false
                var lastDataJob = null;
                scope.$watch('cubeFilter.level', function(level) {
                    areaLayerInitialized = false;
                    var onSuccess = function() {
                        areaLayerInitialized = true;
                        if(lastDataJob) {
                            lastDataJob();
                        }
                    };
                    map.addAreaLayer(level, onSuccess);
                });
                scope.$watch('cube.data', function(data) {
                    var updateMap = function() {
                        lastDataJob = null;
                        map.addData(data, scope.cubeConfig, scope.cubeFilter);
                    };
                    if(areaLayerInitialized) {
                        updateMap();
                    } else {
                        lastDataJob = updateMap;
                    }
                });
            }
        };
    });
})(angular, app);