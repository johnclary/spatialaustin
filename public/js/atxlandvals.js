var color = d3.scale.quantize()
    .domain([-300, 4055])
    .range([
		"rgb(248,245,250)",
		"rgb(240,235,245)",
		"rgb(227,216,235)",
		"rgb(213,189,219)",
		"rgb(206,167,209)",
		"rgb(204,147,200)",
		"rgb(217,117,184)",
		"rgb(224,83,163)",
		"rgb(232,49,143)",
		"rgb(219,31,112)",
		"rgb(199,16,83)",
		"rgb(166,7,70)",
		"rgb(133,0,51)",
		"rgb(102,0,31)"
	]);
	
var classes = [
	"-30 - 0%",
	"0 - 40%",
	"40 - 70%",
	"70 - 100%",
	"100 - 140%",
	"140 - 170%",
	"170 - 200%",
	"200 - 240%",
	"240 - 270%",
	"270 - 310%",
	"310 - 340%",
	"340 - 370%",
	"370 - 410%"
]

var highlightStyle = {
		opacity: 1,
		fillOpacity: .75
	};	
	
var normalStlye = {
	weight: 1,
	opacity: .4,
	fillOpacity: .4
}
	
var southWest = L.latLng(30.29, -97.8),
    northEast = L.latLng(30.4, -97.7),
    bounds = L.latLngBounds(southWest, northEast);

var map = L.map('map',{center: [30.29, -97.737], zoom: 11, minZoom: 9, zoomControl: true, attributionControl : false})
	.addLayer(new L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	opacity: 1
})	)

var featureHighlighted = false;

d3.json('/public/data/new_delta_contours_clipped_proj.geo.json', function(error, data) {
	var contours = L.geoJson(data, {
		onEachFeature: onEachFeature,
		style: styleFeatures
	}).addTo(map);
	
	//clear highlights when clicked away from layer
	map.on("click", function(e){
		contours.setStyle(normalStlye);
	})
	
	//make the legend and attribution
	makeLegend();
	
	//create popup and set click event listener
	function onEachFeature(feature, layer){
		layer.bindPopup("" + 	Math.round(feature.properties.lowcont_nu/100) *10 + " - " + Math.round(feature.properties.highcont_n/100)*10+ "%");
		layer.on({
			click: highlightFeature
		});
	}
	
	//polygon styles
	function styleFeatures(feature){
		return {
			weight: 1,
			color: color(feature.properties.highcont_n),
			opacity: .4,
			fillOpacity: .4
		};
	}
	
	//highlight clicked polygon
	function highlightFeature(e) {
		contours.setStyle(normalStlye); //clear any existing highlight
		var layer = e.target;
		layer.setStyle(highlightStyle);
		//from leaflet reference docs:
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
		d3.selectAll(".leaflet-popup-close-button").on("click", function(){  //listen to popup close button and clear highlighting when clicked
			contours.setStyle(normalStlye); //clear any existing highlight
		})
	}
	
	function makeLegend(){
		var height = 45;
		var width = 231;
		rectSize = width/13;
		
		//use axis for legend
		var axis = d3.svg.axis()
			.scale(color)
			.orient("top");
		
		var legend = L.control({position: 'bottomright'});
		
		legend.onAdd = function (map) {
			var div = L.DomUtil.create('div', 'legend')
			return div;
		};
		legend.addTo(map);
		
		var legendText = d3.select(".legend").append("div").append("p").html("Residential Land Value </br> Change in Austin, TX").attr("class","legend-title");
		
		legendText.append("p").text("2005 - 2015").attr("class", "legend-text");
		
		var legendSvg = d3.select(".legend").attr("id", "legend").append("g").attr("class", "legend-content").append("svg").attr("width", "100%").attr("height", height)
	
		var legendG = legendSvg.selectAll("g").data(classes).enter().append("g");
		
		legendG.append("rect").attr("width", rectSize).attr("height",rectSize-4).attr("y", height-rectSize)
			.attr("x", function(d,i){
				return (i * rectSize)
		}).style("fill", function(d,i){
			return color.range()[i];
		})
		
		
		legendG.append("g").attr("class", "texty").append("text").attr("y", height-(rectSize*1.4))
			.attr("x", function(d,i){
				if (i == 12) {
					return width - 30;
				}
				else {
					return ((i * rectSize))
				}
			})
			.text(function(d,i) {
				if (i == 0) {
					return "-30%"
				}
				if (i == 6) {
					return "+140%";
				}
				if (i == (12)){
					return "+370%"
				}
			}).style("fill", "white");
		

		//attribution
		var attribText = d3.select(".legend").append("div").attr("class", "attribText")
		
		attribText.append("p").append("text").text("Created by ").append("a").attr("href", 'http://spatialaustin.com/atx-land-value').attr("target", "_blank")
		.html("<b>S P A T I A L A U S T I N</b>");
	}
	
})//end contours