var svg = "null";
var lat = 480;
var lon = 480;
d3.csv("/static/smoker.csv", function(err, data) {

    var config = {"data0":"Country","data1":"Youth indicator 1 rate B",
		  "label0":"label 0","label1":"label 1","color0":"#ff7777","color1":"#ff0000",
		  "width":960,"height":960};

    var width = config.width,
	height = config.height,
	centered;

    var COLOR_COUNTS = 9;

    function Interpolate(start, end, steps, count) {
	var s = start,
            e = end,
            final = s + (((e - s) / steps) * count);
	return Math.floor(final);
    }

    function Color(_r, _g, _b) {
	var r, g, b;
	var setColors = function(_r, _g, _b) {
            r = _r;
            g = _g;
            b = _b;
	};

	setColors(_r, _g, _b);
	this.getColors = function() {
            var colors = {
		r: r,
		g: g,
		b: b
            };
            return colors;
	};
    }

    function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
	} : null;
    }

    function valueFormat(d) {
	//console.log(d);
	return d + "%";
    }

    var COLOR_FIRST = config.color0, COLOR_LAST = config.color1;

    var rgb = hexToRgb(COLOR_FIRST);

    var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);

    rgb = hexToRgb(COLOR_LAST);
    var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);

    var startColors = COLOR_START.getColors(),
	endColors = COLOR_END.getColors();

    var colors = [];

    for (var i = 0; i < COLOR_COUNTS; i++) {
	var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
	var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
	var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
	colors.push(new Color(r, g, b));
    }

    var MAP_KEY = config.data0;
    var MAP_VALUE = config.data1;

    var projection = d3.geo.orthographic()
	.scale(250)
	.translate([width / 2, height / 3])
	.clipAngle(90);

    var path = d3.geo.path()
	.projection(projection);

    var graticule = d3.geo.graticule();

    svg = d3.select("#canvas-svg").append("svg")
	.attr("width", width)
	.attr("height", height);

    svg.append("path")
	.datum(graticule)
	.attr("class", "graticule")
	.attr("d", path);


    var valueHash = {};

    function log10(val) {
	return Math.log(val);
    }

    data.forEach(function(d) {
	valueHash[d[MAP_KEY]] = +d[MAP_VALUE];
    });

    var quantize = d3.scale.quantize()
	.domain([0, 1.0])
	.range(d3.range(COLOR_COUNTS).map(function(i) { return i }));

    quantize.domain([d3.min(data, function(d){
	return (+d[MAP_VALUE]) }),
		     d3.max(data, function(d){
			 return (+d[MAP_VALUE]) })]);

    d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/world-topo-min.json", function(error, world) {
	var countries = topojson.feature(world, world.objects.countries).features;

	//svg = d3.select("#canvas-svg").append("svg").attr("width", width).attr("height", height);

	svg.append("path").datum(graticule).attr("class", "choropleth").attr("d", path);

	var g = svg.append("g");

	g.append("path")
	    .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
	    .attr("class", "equator")
	    .attr("d", path);

	var country = g.selectAll(".country").data(countries);

	country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d,i) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            .style("fill", function(d) {
		if (valueHash[d.properties.name]) {
		    var c = quantize((valueHash[d.properties.name]));
		    var color = colors[c].getColors();
		    return "rgb(" + color.r + "," + color.g +
			"," + color.b + ")";
		} else {
		    return "#ccc";
		}
            })
            .on("mousemove", function(d) {
		var html = "";

		html += "<div class=\"tooltip_kv\">";
		html += "<span class=\"tooltip_key\">";
		html += d.properties.name;
		html += "</span>";
		html += "<span class=\"tooltip_value\">";
		html += (valueHash[d.properties.name] ? valueFormat(valueHash[d.properties.name]) : "");
		html += "";
		html += "</span>";
		html += "</div>";

		$("#tooltip-container").html(html);
		$(this).attr("fill-opacity", "0.8");
		$("#tooltip-container").show();

		var coordinates = d3.mouse(this);

		var map_width = $('.choropleth')[0].getBoundingClientRect().width;

		if (d3.event.pageX < map_width / 2) {
		    d3.select("#tooltip-container")
			.style("top", (d3.event.layerY + 15) + "px")
			.style("left", (d3.event.layerX + 15) + "px");
		} else {
		    var tooltip_width = $("#tooltip-container").width();
		    d3.select("#tooltip-container")
			.style("top", (d3.event.layerY + 15) + "px")
			.style("left", (d3.event.layerX - tooltip_width - 30) + "px");
		}
            })
            .on("mouseout", function() {
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
            })
	    .on("click", function(d) {
		var x, y, k;
		console.log("clicked");
		if (d && centered !== d) {
		    var centroid = path.centroid(d);
		    x = centroid[0];
		    y = centroid[1];
		    k = 4;
		    centered = d;
		} else {
		    x = width / 2;
		    y = height / 2;
		    k = 1;
		    centered = null;
		}

		g.selectAll("path")
		    .classed("active", centered && function(d) { return d === centered; });

		g.transition()
		    .duration(750)
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
		    .style("stroke-width", 1.5 / k + "px");
	    });

	g.append("path")
            .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
            .attr("class", "boundary")
            .attr("d", path);

	svg.attr("height", config.height * 2.2 / 3);


	var path2 = d3.geo.path().projection(projection);

	var λ = d3.scale.linear().domain([0, width]).range([-180, 180]);

	var φ = d3.scale.linear().domain([0, height]).range([90, -90]);

	//var svg2 = d3.select("body").append("svg").attr("width", width).attr("height", height);
	var thingToMove = document.getElementsByTagName('svg')[0];
    //deadfix=(lat == 680 && lon == 460) || (lat == 960 && lon == 500) ? 20 : 0;
	document.onkeydown = function(event) {
            if (event.keyCode == 37) {
		              lat += 20;
                      lat += (lat == 480 && lon == 460) || (lat == 960 && lon == 500) ? 20 : 0;
            }
            if (event.keyCode == 38) {
		              lon += 20;
                      lon += (lat == 480 && lon == 460) || (lat == 960 && lon == 500) ? 20 : 0;
            }
            if (event.keyCode == 39) {
		              lat -= 20;
                      lat -= (lat == 480 && lon == 460) || (lat == 960 && lon == 500) ? 20 : 0;
            }
            if (event.keyCode == 40) {
		              lon -= 20;
                      lon -= (lat == 480 && lon == 460) || (lat == 960 && lon == 500) ? 20 : 0;
            }
         var p = [lat, lon];
	    console.log(p);
	    projection.rotate([λ(p[0]), φ(p[1])]);
	    svg.selectAll("path").attr("d", path2); };

    });

    //d3.select(self.frameElement).style("height", (height * 2.3 / 3) + "px");
});


function clicked(d) {

}
