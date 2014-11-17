(function (app, d3, topojson) {
    'use strict';

    var colors = ["#ffdf90", "#ffc32d", "#ff6600", "#ff2f01", "#c10100", "#8d0001", "#520000", "#24000b"];

    /* cartogram specific */
    app.cartogram = function (svgSelector) {
        var svg, zoom, areas, carto, path, topology, geometries;

        this.setup = function () {
            var setupSvg = function () {
                svg = d3.select(svgSelector)
                    .style({height: '960px', width: '960px'})
                    .attr("viewBox", "0 0 " + 960 + " " + 960)
                    .attr("class", "bubble");
                areas = svg.append("g").attr('class', 'layer').selectAll("path");
            };

            var setupZoom = function () {
                zoom = d3.behavior.zoom()
                    .translate([-12100, -1900])
                    .scale(25)
                    .scaleExtent([1, 8]);
                var scale = zoom.scale();
                svg.select('.layer').attr("transform", "translate(" + zoom.translate() + ") " + "scale(" + [scale, scale] + ")");
            };

            var setupCartogram = function () {
                var proj = d3.geo.mercator();
                path = d3.geo.path()
                    .projection(proj);
                carto = d3.cartogram()
                    .projection(proj)
                    .properties(function (d) {
                        return d.properties;
                    });
            };

            setupSvg();
            setupZoom();
            setupCartogram();
        };

        this.updateData = function (data) {
            if (!topology || !geometries) return true;

            var values = areas.data()
                .map(function (d) {
                    return data[d.properties.RS];
                })
                .filter(function (n) {
                    return !isNaN(n);
                })
                .sort(d3.ascending);
            var lo = values[0];
            var hi = values[values.length - 1];
            var getValue = function (d) {
                return data[d.properties.RS] ? data[d.properties.RS] : d3.mean(values);
            };

            var color = d3.scale.quantize()
                .range(colors)
                .domain(lo < 0 ? [lo, 0, hi] : [lo, d3.mean(values), hi]);

            // normalize the scale to positive numbers
            var scale = d3.scale.linear()
                .domain([lo, hi])
                .range([1, 1000]);

            // tell the cartogram to use the scaled values
            carto.value(function (d) {
                return scale(getValue(d));
            });

            // generate the new features, pre-projected
            var features = carto(topology, geometries).features;

            // update the data
            areas.data(features)
                .transition()
                .duration(750)
                .ease("linear")
                .attr("fill", function (d) {
                    return color(getValue(d));
                })
                .attr("d", carto.path);
        };

        this.updateAreas = function (_topology) {
            topology = _topology;
            geometries = topology.objects[Object.keys(topology.objects)[0]].geometries;
            var features = carto.features(topology, geometries);

            areas = areas.data(features);
            areas.exit().remove();
            areas.enter()
                .append("path");
            areas
                .attr("d", path)
                .attr("fill", "#fafafa");
        };

        this.setup();
    };
})(app, d3, topojson);