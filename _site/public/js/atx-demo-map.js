// default styles
var fillColor = "rgba(255,43,153,0)"
var strokeColor = "rgba(255,43,153,1)" //pink!
var hoverColor = "rgba(255,43,153,.4)"
var strokeWidth = .75;
var margin = {top: 0, right: 20, bottom: 20, left: 120},
    width = 500 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

// other globals
var date;
var low = new Date("1/1/2007")
var high = new Date("5/1/2015")
var parseDate = d3.time.format("%b %Y");
var svg2;
var tooltipOpen = false;

var x = d3.time.scale()
    .domain([new Date(2007, 0, 1), new Date(2015, 4, 1)])
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var brush = d3.svg.brush()
    .x(x)
    .extent([new Date(2007, 0, 1), new Date(2015, 4, 1)])
    .on("brushstart", brushstart)
    .on("brush", brushmove)
    .on("brushend", brushend);

var map = L.map('map',{center: [30.26, -97.737], zoom: 12, minZoom: 11, zoomControl: false, attributionControl : false})
	.addLayer(new L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18
})	)

L.control.attribution({position: 'bottomleft'}).addTo(map);
new L.Control.Zoom({ position: 'topright' }).addTo(map);

map.on('load', makeTooltip());

var	svg = d3.select(map.getPanes().overlayPane).append("svg").attr("class", "svgTooltip");	
var	g = svg.append("g").attr("class", "leaflet-zoom-hide");

d3.json('/public/data/demo_final.topo.json', function(error, parcels) {
		data = parcels;
		var path = d3.geo.path().projection(project);  

		var feature = g.selectAll("path")
			.data(topojson.feature(parcels, parcels.objects.parcels).features)
			.enter().append("path")
			.attr("class", "parcels")
			.attr("fill", fillColor)
			.attr("stroke", strokeColor)
			.attr("stroke-width", strokeWidth)
			.style("cursor", "default")
			.on("click", function(d) { 
				console.log("clicked a parcel!");
				if (tooltipOpen == true) { //if the tooltip is already open when a parcel is clicked; remove the existing tooltip.
					d3.select(this).classed("hidden", true)
					d3.select("#tooltip").select("div").remove();
					d3.select("#selected").attr("fill", fillColor).attr("id", "")
					tooltipOpen = false;
				}
				d3.select(this).attr("fill", hoverColor).attr("id", "selected");
				d3.select("#tooltip").append("div").attr("width", "300px").attr("id", "imageContainer")
					.html(function() {
						var address = d.properties.address
						var date = (d.properties.date).substring(0,4); //get date from json feature property
						description = d.properties.descriptio
						var lat = d.properties.lat
						var lon = d.properties.lon
						d3.select("#tooltip").classed("hidden", false);//Show the tooltip..tucked in hear because of synchronous bullsheeeit
						tooltipOpen = true;
						return "<img id=googleThumb src='https://maps.googleapis.com/maps/api/streetview?size=300x300&location=" + lat + "," + lon + "'" + " /><div  id=address style='font-weight: bold'>" +  address + "</div><div id=description style='font-style: italic;'>" +  date + ": "  + description + "</div>"
					})
					//add close button to tooltip
					d3.select("#imageContainer").insert("a", "#googleThumb").attr("href", "#").attr("id", "close").append("img").attr("src",'/public/images/x_3.png').attr("width", 20).attr("height", 20).on("click", function(){
						d3.select("#tooltip").classed("hidden", true)
						d3.select("#tooltip").select("div").remove();
						d3.select("#selected").attr("fill", fillColor).attr("id", "")
					})
			});

		map.on('zoomend', checkZoom);
		map.on("viewreset", reset);
		map.on("dragend", reset);
		reset();

	function reset() {
        bounds = [[map.getBounds()._southWest.lng, map.getBounds()._southWest.lat],[map.getBounds()._northEast.lng, map.getBounds()._northEast.lat]]
        var bottomLeft = project(bounds[0]),
            topRight = project(bounds[1]);

        svg.attr("width", topRight[0] - bottomLeft[0])
            .attr("height", bottomLeft[1] - topRight[1])
            .style("margin-left", bottomLeft[0] + "px")
            .style("margin-top", topRight[1] + "px");

        g.attr("transform", "translate(" + -bottomLeft[0] + "," + -topRight[1] + ")"); 

        feature.attr("d", path);
      }

	function project(point) {
		var latlng = new L.LatLng(point[1], point[0]);
		var layerPoint = map.latLngToLayerPoint(latlng);
		return [layerPoint.x, layerPoint.y];
	}  
});

function makeTooltip() {
	var tooly = L.control({position: 'topleft'});
	tooly.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'hidden info tooltip')
		return div;
	};
	tooly.addTo(map); //add hidden tooltip box to map
	d3.select(".tooltip").attr("id", "tooltip")
	makeLegend();
};//end makeTooltip

//'legend' for the slider
function makeLegend(){
	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'legend')
		return div;
	};
	legend.addTo(map);
	makeBrush()
}

function makeBrush(){
	//legend title
	legendText = d3.select(".legend").append("div");
	legendText.append("p").text("Austin Building Demolitions").attr("class", "legendTitle");
	legendText.append("p").text(parseDate(low) + " - " + parseDate(high)).attr("class", "legendText");
	
	//
	svg2 = d3.select(".legend").append("svg").attr("class", "chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + (margin.left) + "," + margin.top + ")");	

	d3.csv("/public/data/demo-bar-data.csv", type, function(error, data) {
		length = data.length;
		y.domain([20, 125]);

	  //axis
		svg2.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.svg.axis().scale(x).orient("bottom"));
	  
	   bar = svg2.append("g").selectAll("rect")
		  .data(data)
		  .enter().append("rect")
		  .attr("transform", function(d) { 
			 return "translate(" + x(new Date(d.date)) + ",0)";
		  })
		  .attr("y", function(d) { return y(d.value); })
		  .attr("height", function(d) { return height - y(d.value); })
		  .attr("width", function(d) {
			return width/(length-6);
			})
		
		var brushg = svg2.append("g")
			.attr("class", "brush")
			.call(brush);
		//attribute handles courtesy of: http://bl.ocks.org/jisaacks/5678983
		brushg.selectAll(".w").append("image")
			.attr("width", 15)
			.attr("height", height)
			.attr("xlink:href",'/public/images/left-handle.png')
			.attr("transform", "translate(-12," +  0 + ")")
		
		brushg.selectAll(".e").append("image")
			.attr("width", 15)
			.attr("height", height)
			.attr("xlink:href",'/public/images/right-handle.png')
			.attr("transform", "translate(" + (-width/(length-6)) + "," +  0 + ")")

		brushg.selectAll("rect")
			.attr("height", height);

	}); 
	attribText = d3.select(".legend").append("div");
	attribText.append("p").attr("class", "attribText").text("Created by ").append("a").attr("href", 'http://spatialaustin.com').attr("target", "_blank").html("<b>S P A T I A L A U S T I N</b>");
}

function checkZoom() {
	var zoom = map._zoom
	var currentStrokeWidth = strokeWidth;
	if (zoom > 12 && zoom < 16) { strokeWidth = 1; };
	if (zoom > 15 ) { strokeWidth = 2; };
	if (zoom <= 12)	{strokeWidth = .5 ;};
	if (currentStrokeWidth != strokeWidth) {
		d3.selectAll(".parcels").attr("stroke-width", strokeWidth);
	}
} //end checkZoom

function brushstart() {
	//disable map listeners while interacting with brush
	map.dragging.disable();
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	map.boxZoom.disable();
	map.keyboard.disable();
	//
	svg2.classed("selecting", true);
}

function brushmove() {
  var s = brush.extent();
 low = s[0]  //beginning of extent
 high = s[1] //end of extent
 dateFilter()
  bar.classed("selected", function(d) { 
	  date = new Date(d.date)
	  d3.selectAll
	  return s[0] <= date && date <= s[1]; });
}

function brushend() {
	map.dragging.enable();
	map.touchZoom.enable();
	map.doubleClickZoom.enable();
	map.scrollWheelZoom.enable();
	map.boxZoom.enable();
	map.keyboard.enable();
	//
  svg2.classed("selecting", !d3.event.target.empty());
}

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

function dateFilter() {
	d3.selectAll(".parcels")
				.attr("stroke", function(d) {
					date = new Date(d.properties.date)
						if (low <= date && date <= high) {
							return strokeColor;
						} else {
							return "none";
						}
				})
	d3.selectAll(".legendText").text(parseDate(low) + " - " + parseDate(high)).attr("class", "legendText");
}