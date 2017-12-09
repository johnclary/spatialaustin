////map variables
var	dataList = ["Gross Rent","Home Value","Household Income"] //hardcode your different demographic types here
var	dataChoice = 0 //default
var	formatPct = d3.format("1%")
var	strkColor = "white";
var	strkWidth = 3;
var	colorScale = ["#8c96c6", "#8c6bb1", "#88419d", "#810f7c","#4d004b"]; //for filling any value >= 0 and for creating quantiles
var	rangeScale = ["#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"]; //for drawing legend
var	color = d3.scale.quantile().range(colorScale);

var	map = new L.Map("map", {center: [30.288332, -97.738295], zoom: 11, zoomControl: false})
		.addLayer(new L.TileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
		}));

	
var	svg = d3.select(map.getPanes().overlayPane).append("svg"),
		g = svg.append("g").attr("class", "leaflet-zoom-hide");

d3.csv("/public/data/2000_2012tractChangeFinal.csv", function(dataset) { //load csv data
		
		domainArray = [];
        for (var q = 0; q < dataset.length; q++) {
            theValue = parseFloat(dataset[q][dataList[dataChoice]]);
            if (isNaN(theValue)==false) { //if the value for that tract is a number
                if (theValue > 0) { //if the value for that tract is greater than zero
					domainArray.push(theValue); //add to list for quantile calculations
                }
            };
        };           
       
        color.domain(domainArray)
		
		//Load GeoJSON dataset
		d3.json("/public/data/Tracts_2010_84_shaped2dot8pct.json", function(json) {
						
			//Merge the dataset and GeoJSON
			//Loop through once for each dataset value
			for (var i = 0; i < dataset.length; i++) {
				//Grab state name
				var tractID = dataset[i].tractID; 
				//Grab dataset value, and convert from string to float. remember, csv dataset is always read-in as a string
				var rentChange = parseFloat(dataset[i]["Gross Rent"]);
				var valueChange = parseFloat(dataset[i]["Home Value"]);
				var incomeChange = parseFloat(dataset[i]["Household Income"]);
					
				//match up the fids from the csv and json
				for (var j = 0; j < json.features.length; j++) { 

					var jsonFid = json.features[j].properties.FID;

					if (tractID == jsonFid) {
						//Copy the dataset value into the JSON
						json.features[j].properties["Gross Rent"] = rentChange;
						json.features[j].properties["Home Value"] = valueChange;
						json.features[j].properties["Household Income"] = incomeChange;
						//Stop looking through the JSON
						break;
					}
				}
			}	

		var	transform = d3.geo.transform({point: projectPoint}),
				path = d3.geo.path().projection(transform);
		
		var	feature = g.selectAll("path")
				.data(json.features)
				.enter().append("path")
				.attr("fill-opacity", function(d) {
									var dataColor = d.properties[dataList[dataChoice]]; 
									if (dataColor) {	
										return 0.8
										} 
									else { return 0 } //if the path has no data it is white and opaque
								})
				.attr("stroke", "white")
				.attr("stroke-width", 2 )
				.attr("stroke-opacity", 0.0)
				.attr("fill", function(d) {
									var dataColor = d.properties[dataList[dataChoice]];  //retrieves data value accroding to selected dataChoice
									if (dataColor) {	
										if (dataColor >= 0) {
											return color(dataColor)
										} //and retrieves color based on dataChoice value, assigning outpt to dataColor
										else {
											return rangeScale[0];
										}
									}
									else { return "white" } 
								})
				
				.on("mouseover", function(d) {
							
							dataColor = d3.select(this).attr("fill"); //get the fill of the moused-over element
							
							g.append("path") //and append a new outline of the path over the shape (because otherwise edges overlap)
								.attr("d", d3.select(this).attr("d"))
								.attr("id", "pathSelection")
								.attr("stroke", "white")
								.attr("stroke-opacity", 0)
								.attr("fill", "none")
								.attr("stroke-width", strkWidth*1.5)
								.attr("stroke", function(d) { //and the outline color is a darker version of the original fill
									return d3.rgb(dataColor).darker(.8);
								})
								.transition()
								.duration(150)
								.attr("stroke-opacity", 1.0)
							
							d3.select("#tooltip")
								.select("#valueB")
								.html(function() {
									var tract = d.properties.FID.substring(5)
									var theValue = d.properties[dataList[dataChoice]]
									if (isNaN(theValue)==false) {
										if (theValue >= 0) {
											return "From 2000 to 2012, the median " + dataList[dataChoice].toLowerCase() + " <br/>in census tract " + tract + " increased by " + formatPct(theValue);
											}
										else {
											return "From 2000 to 2012, the median " + dataList[dataChoice].toLowerCase() + " <br/>in census tract " + tract + " decreased by " + formatPct(theValue);
										}
									}
									else { return "No Data" }
								})
								
							d3.select("#tooltip").classed("hidden", false);//Show the tooltip
				})
					
				.on("mouseout", function(d) { //remove temp objects and return opacity to normal					
							d3.select("#pathSelection").remove();
							d3.select("#tooltip").classed("hidden", true);
				})
				
		map.on("viewreset", reset);
		reset();
		makeLegend();
		dataControls();
		makeTooltip();
		
		d3.selectAll("select") //drop-down menu responder
					.on("change", function() {
						
				    	dataChoice = d3.event.target.value;  //grabs value from menu option
						changeData();
						makeLegend();
						});
		
		function reset() {
			var	bounds = path.bounds(json),
					topLeft = bounds[0],
					bottomRight = bounds[1];
			
			svg	.attr("width", bottomRight[0] - topLeft[0])
					.attr("height", bottomRight[1] - topLeft[1])
					.style("left", topLeft[0] + "px")
					.style("top", topLeft[1] + "px");

			g		.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
			
			feature.attr("d", path);
			d3.select("#pathSelection").remove(); //remove mouseover boundary highlight
		}
		
		function projectPoint(x, y) {
			var point = map.latLngToLayerPoint(new L.LatLng(y, x));
			this.stream.point(point.x, point.y);
		}
		
		function changeData() {
			domainArray = [];
			
			for (var q = 0; q < dataset.length; q++) {
				theValue = parseFloat(dataset[q][dataList[dataChoice]]);
				if (isNaN(theValue)==false) { //if the value for that tract is a number
					if (theValue > 0) { //if the value for that tract is greater than zero
						domainArray.push(theValue); //add to list for quantile calculations
					}
				};
			};           
		   
			color.domain(domainArray)
			
			var feature = d3.selectAll("path") //redraw geoJSON paths with new fills
				.data(json.features)
				.transition()
				.ease("linear")
				.duration(500)			
				.attr("fill", function(d) {
					var dataColor = d.properties[dataList[dataChoice]];  //retrieve data value according to selected dataChoice
					if (dataColor) {	
						if (dataColor >= 0) {
							return color(dataColor)
						} //and retrieve color based on dataChoice value
						else {
							return rangeScale[0];
						}
					}
					else { return "white" } 
				})
				.attr("fill-opacity", function(d) {
					var dataColor = d.properties[dataList[dataChoice]];
					if (dataColor) {	
						return 0.8
						} 
					else { return 0 } //if the path has no data it is white and opaque
				})		
		};
		
		function dataControls() {
	
			var menu = L.control({position: 'topleft'});

			menu.onAdd = function (map) {
				var div = L.DomUtil.create('div', 'control info')
				L.DomEvent.disableClickPropagation(div);
				return div;
			};
			
			menu.addTo(map); //add control box to map

			var dropDown = d3.select(".control").append("select");  //data values must match json variable names data

			for (var i = 0; i < dataList.length; i++) {
					dropDown.append("option").attr("value", i).text(dataList[i]);
			}

		}; //end dataControls
		

		function makeTooltip() {

			var tooly = L.control({position: 'topleft'});
			
			tooly.onAdd = function (map) {
				var div = L.DomUtil.create('div', 'hidden info tooltip')
				return div;
			};
			
			tooly.addTo(map); //add hidden tooltip box to map
			
			d3.select(".tooltip").attr("id", "tooltip")
				.append("p")
				.append("span").attr("id", "valueA")
			
			d3.select(".tooltip").attr("id", "tooltip")
				.append("p")
				.append("span").attr("id", "valueB")
	
		};//end makeTooltip
		
		function makeLegend() {
			d3.selectAll(".legend").remove() //remove existing legend
			
			var legend = L.control({position: 'bottomleft'});
			
			legend.onAdd = function (map) {
				var div = L.DomUtil.create('div', 'info legend')
				return div;
			};
			
			legend.addTo(map);
			
			for (var i = 0; i < rangeScale.length; i++) {
				d3.select(".legend").append("p").attr("class", "legend").text(function(){
					if (i == 0) { //"highest class"							
						legendValue = parseFloat(color.invertExtent(colorScale[(colorScale.length-i-1)])[0])-.01
						return "> "+ formatPct(legendValue)
					}
					if (i == rangeScale.length-2) {  //2nd class from bottom
						return " 0 - " + formatPct(parseFloat(color.invertExtent(colorScale[(colorScale.length-i-1)])[1]-.01))
					}
					if (i == rangeScale.length-1) {  //bottom class
						return "< 0%"
					}
					else {
						return d3.round(((parseFloat(color.invertExtent(colorScale[(colorScale.length-i-1)])[0]))*100)) +  " - " + formatPct(parseFloat(color.invertExtent(colorScale[(colorScale.length-i-1)])[1]-.01))  //get the domain value (invertExtent) of the color at position i-1 in the colorScale. this is an array. take the first (left side) or second (right side) object in the ray and if on the right side subtract 1 percent
					}
				})
				.append("span").style("background", function(){
						return rangeScale[(rangeScale.length-i-1)]; //[- i - 1] because the legend is drawn in descending order (vertically, from top ("highest class") to bottom ("lowest class))
					})					
					
				d3.select(".legend").append("br")				
			};
		};
	});		
});