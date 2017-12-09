//map defaults
var width = 700,
    height = 700,
    rotate = [98, -31],
	txRotate = [98, -31],
	scale =1000,
	precision = 0.3,
	translate = [width/2, height/2],
	clipAngle = 20,
	checkPoint = [0,0],
	scaleChoice = "large",
	selectedColor = "#b2182b",
	nonSelectedColor = 'gray',
	texasFill = "rgba(33,102,172, .5)",
	lineWidth = .75,
	texasStrokeColor = "rgb(5,48,97)",
	backgroundColor = "#FAFFFB",
	textColor = "black";

// other globals
var centroid, land, texas, lakes, countryPolys, mapProjection, currentProjection, m0, o0, selectedCountry, selectedData, newRotate;

var projections = [d3.geo.azimuthalEqualArea(), d3.geo.mercator(), d3.geo.orthographic(), d3.geo.gnomonic(), d3.geo.aitoff()]

var scales = {
		"small": {"scale": 350, "clip": 60,"translate":[width/2, height/2 + 15], "lineWidth": .25 },
		"medium": {"scale": 500, "clip": 40, "translate":[width/2, height/2], "lineWidth": .5 },
		"large": {"scale": 1000, "clip": 20, "translate":[width/2, height/2 + 40], "lineWidth": .75 }
	}

var projectionTX = d3.geo.azimuthalEqualArea()
	.translate(translate)
	.scale(scale)
	.rotate(rotate);
	
var pathTX = d3.geo.path().projection(projectionTX);

var projection = d3.geo.azimuthalEqualArea()
     .scale(scale)
     .precision(precision)
     .clipAngle(clipAngle)
	 .translate(translate)
     .rotate(rotate);

var path = d3.geo.path().projection(projection);

var drag = d3.behavior.drag()

queue()
    .defer(d3.json, "/public/data/barelySimpd.Topo.json")
    .defer(d3.json, "/public/data/texas_simp_2.json")
	.defer(d3.json, "/public/data/fixedupJSON_mini.json")
	.defer(d3.json, "/public/data/great_Lakes.topo_2.json")
    .await(ready);

function ready(error, topoj, texas, countryPolys, lakers) { //
	d3.select(".loading").remove()
	drag.on("dragstart", function() {
		// Adapted from http://mbostock.github.io/d3/talk/20111018/azimuthal.html and updated for d3 v3
		var proj = projection.rotate();
		m0 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY];
		o0 = [-proj[0],-proj[1]];
	})
	
	.on("drag", function() {
		var currentCountry = selectedCountry //remember what country is currently selected
		if (m0) {
			var m1 = [d3.event.sourceEvent.pageX, d3.event.sourceEvent.pageY],
				o1 = [o0[0] + (m0[0] - m1[0]) / 8, o0[1] + (m1[1] - m0[1]) / 8];
			projection.rotate([-o1[0], -o1[1]]);
		}
		// Update the map
		path = d3.geo.path().projection(projection);
		rotate = projection.rotate(); // get the coordinates of the center of the map and store as a geojson object
		//correct the rotation values to match lat/lon....this was not fun to diagnose and i'm sure there's an easier way
		if (rotate[0] > 180 && rotate[1] > -90 && rotate[1] < 90)
		{  
			rotate[0] = rotate[0] - 360
		}
		if (rotate[0] < -180 && rotate[1] > -90 && rotate[1] < 90){
			rotate[0] = rotate[0] + 360
		}
		if (rotate[1] > 90){
			rotate[1] = (rotate[1] - 180) * -1
			rotate[0] = rotate[0] - 180
		}
		if (rotate[1] < -90){
			rotate[1] = rotate[1] + 180
			rotate[0] = rotate[0]  + 180
		}

		checkPoint = turf.point([-rotate[0],-rotate[1]]);

		for (var i = 0; i < countryPolys.features.length; i++) {  //check all polygons to see if the current center of the map (inverse of rotate) is inside the polygon
			if(turf.inside(checkPoint, countryPolys.features[i]) == true) {
				selectedCountry = countryPolys.features[i].properties.realName;
				selectedArea = parseFloat(countryPolys.features[i].properties.area)			
				break
			}
			else {
				selectedCountry = ""
			}
		}
		//draw the geojson path of the selected country
		for (var i = 0; i < countryPolys.features.length; i++) {
			if (selectedCountry == countryPolys.features[i].properties.realName) {
				selectedData = countryPolys.features[i]
			}
		}
		// clear context and draw the map at new rotation
		context.clearRect(0, 0, width, height);
		context.fillStyle = nonSelectedColor;
		context.strokeStyle = backgroundColor;
		context.beginPath(), path.context(context)(land), context.fill(), context.stroke();

		//draw the the selected country over it.
		context.fillStyle = selectedColor;
		context.beginPath(), path.context(context)(selectedData), context.fill(), context.stroke();
		
		//draw the great lakes
		context.fillStyle = backgroundColor;
		context.beginPath(), path.context(context)(lakes), context.fill(), context.stroke();
		
		//draw texas overlay
		context.fillStyle = texasFill;
		context.lineWidth = scales[scaleChoice].lineWidth;
		context.strokeStyle = texasStrokeColor;
		context.beginPath(), pathTX.context(context)(texas), context.fill(), context.stroke();
		
		//draw country label
		centroid = d3.geo.centroid(selectedData);
		context.fillStyle = textColor;
		context.fillText(selectedCountry, projection(centroid)[0], projection(centroid)[1]) 

	});
	var selectProj = d3.selectAll("#proj")
	var selectScale = d3.selectAll("#scaler")
	
	selectProj.on("change", function() {					
		projection = projections[d3.event.target.value];
		updateProj(); 
	});
	
	selectScale.on("change", function() {					
		scaleChoice = d3.event.target.value;  //grabs value from menu option
		translate = scales[scaleChoice].translate;
		scale = scales[scaleChoice].scale;
		clipAngle = scales[scaleChoice].clip;
		updateProj();
	});
		
	var canvas = d3.select("div").append("canvas")
		.attr("width", width)
		.attr("height", height) 
		.call(drag);

	var context = canvas.node().getContext("2d");
	context.strokeStyle = backgroundColor;
	context.fillStyle = nonSelectedColor;
	context.lineCap = 'round';
	context.lineJoin = 'round';
	context.font = "16px sans-serif";
	context.textAlign = "center";

	//draw countries
	land = topojson.feature(topoj, topoj.objects.collection)
	context.beginPath(), path.context(context)(land), context.fill(), context.stroke();
	
	//draw lakes
	lakes = topojson.feature(lakers, lakers.objects.collection)
	context.fillStyle = backgroundColor;
	context.beginPath(), path.context(context)(lakes), context.fill(), context.stroke();
	
	//draw tejas
	context.fillStyle = texasFill;
	context.lineWidth = lineWidth;
	context.beginPath(), path.context(context)(texas), context.fill(), context.stroke();
	
	function updateProj() {
		
		projection.scale(5);
		projectionTX.scale(5);
		
		while  (!(scale == projection.scale() && (projectionTX.rotate()).join() == [ 98, -31, 0 ].join())) {
			
			projectionTX.translate(translate).scale(scale).rotate(txRotate);
			pathTX = d3.geo.path().projection(projectionTX);
			
			projection.scale(scale).precision(precision).clipAngle(clipAngle).translate(translate).rotate(rotate);
			path = d3.geo.path().projection(projection);
		};
		refreshMap();
	}
	
	function refreshMap() {
		// clear context and draw the map at new rotation
		context.clearRect(0, 0, width, height);
		context.fillStyle = nonSelectedColor;
		context.strokeStyle = backgroundColor;
		context.lineWidth = scales[scaleChoice].lineWidth;
		context.beginPath(), path.context(context)(land), context.fill(), context.stroke();

		//draw the great lakes
		context.fillStyle = backgroundColor;
		context.beginPath(), path.context(context)(lakes), context.fill(), context.stroke();
		
		//draw texas overlay
		context.fillStyle = texasFill;
		context.strokeStyle = texasStrokeColor;
		context.beginPath(), pathTX.context(context)(texas), context.fill(), context.stroke();
	}
};