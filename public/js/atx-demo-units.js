//  https://www.google.com/maps/@30.2840865,-97.7716971,3a,76.1y,24.21h,85.44t/data=!3m6!1e1!3m4!1sT9kFV7OEYtJET5J6o6jEMg!2e0!7i13312!8i6656
var clicked_feature;
var formatPct = d3.format(".1%");

var colorScale = d3.scaleSequential(d3.interpolateRdPu)
    .domain([0,.2]);


// set the ranges
var x = d3.scaleBand()
          .padding(0.1);

var y = d3.scaleLinear()
          
var layers = {
    stamen_toner_lite: L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
        attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains : 'abcd',
        maxZoom : 20,
        ext : 'png'
    })
}

var map_options = {
    center : [30.27, -97.74],
    zoom : 12,
    minZoom : 1,
    maxZoom : 19
};

d3.json('/public/data/austin_tracts.json', function(error, data) {

    d3.json('/public/data/demos_by_year.json', function(error, demos) {

    	var tracts = new L.GeoJSON(data, {
        	style: function (feature) {
                var style = getStyle(feature)
                return style;
        	},
            onEachFeature: function (feature, layer) {
                layer.on('click', function (pt) {
                    if (clicked_feature) {
                        tracts.resetStyle(clicked_feature);
                    }
                    clicked_feature = this;
                    var style = getStyle(feature, click=true)
                    this.setStyle(style);
                    var chart_data = demos[feature.properties.FID];
                    map.panTo(pt.latlng);
                    map.panBy([0,-100])
                    console.log(pt);

                });

                var pct_demo = formatPct(feature.properties.pct_demo);
                var num_demo = feature.properties.num_demo;
                

                if (!isNaN(num_demo)) {
                    pct_demo = '(' + pct_demo + ')';

                    layer.bindPopup('<div class="chart-wrapper"><text>SF Units Demolished: <b>' + num_demo +  ' ' + pct_demo + '</b></text></div>');

                    layer.on('popupopen', function(){
                        var demo_data = demos[feature.properties.FID]
                        makeChart(demo_data);    
                    });

                }


        }
    	})

        var map = new L.Map('map', map_options)
            .addLayer(layers['stamen_toner_lite'])
            .addLayer(tracts)
            .on('click', function(){
                //  reset styles on map click
                if (clicked_feature) {
                    tracts.resetStyle(clicked_feature);
                    clicked_feature = null;
                }
            })
            .on('popupclose', function(){
                //  reset styles when popup closed
                if (clicked_feature) {
                    tracts.resetStyle(clicked_feature);
                    clicked_feature = null;
                }

                // display legend (may have been hidden on smaller screen)
                d3.select('.legend').style('visibility', 'visible');
            });

        makeLegend(map);

    })
        
});


function getStyle(feature, click=false) {
    var pct = feature.properties.pct_demo;
    var color = colorScale(pct);
    var fillOpacity = .7;
    var stroke = false;
    var weight = 0;

    if (isNaN(pct)) {
        color = '#000';
        fillOpacity = 0;
    } else if (click) {
        weight = 5;
        stroke = true;
    }

    return {
        color: color,
        stroke: stroke,
        fillOpacity: fillOpacity,
    };
}


function makeLegend(map) {
    
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            pcts = [0, 4, 8, 12, 16, 20],
            labels = ['0%', '4%', '8%', '12%','16%', '20%'];

        div.innerHTML += '<p><b>% Single-Family Units Demolished</b><br>2000-2017</p>'
        // straight from the leaflet tutorial
        for (var i = 0; i < labels.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorScale(pcts[i]/100) + '"></i> ' +
                labels[i] + (labels[i + 1] ? '&ndash;' + labels[i + 1] + '<br>' : '+');
        }
        

        attribText = d3.select(div).append("div");
        attribText.append("p").attr("class", "attribText").text("Created by ").append("a").attr("href", 'http://spatialaustin.com').attr("target", "_blank").html("<b>S P A T I A L A U S T I N</b>");

        return div;
    };

    legend.addTo(map);       
};


async function makeChart(data) {
    //  get chart dimensions
    var dims = getDimensions();

    //  update scales
    x.range([0, dims.width])
    y.range([dims.height, 0]);

    d3.select('.leaflet-popup-content-wrapper')
        .style('width', (dims.width + dims.margin.left + dims.margin.right + 5) + 'px');


    (dims.screenH < 600 || dims.screenH < 600) ? d3.select('.legend').style('visibility', 'hidden') : '';

    await sleep(200);
    
    if (!data) {
        return;
    }

    var svg = d3.select('.leaflet-popup-content')
        .append('svg')
        .attr('class', 'chart')
        .attr("width", dims.width + dims.margin.left + dims.margin.right)
        .attr("height", dims.height + dims.margin.top + dims.margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + dims.margin.left + "," + dims.margin.top + ")");
    
    var years = d3.keys(data);
    var demos = d3.values(data);

    x.domain(years);
    y.domain([0, d3.max(demos)]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(demos)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) { return x(years[i]); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return dims.height - y(d); });

      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + dims.height + ")")
          .attr("class", "axisWhite")
          .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      // add the y Axis
      svg.append("g")
            .attr("class", "axisWhite")
          .call(d3.axisLeft(y).tickFormat(d3.format("d")));

      var ticks = d3.selectAll(".tick text");
      
      ticks.attr("class", function(d,i){
        if(i%4 != 0) d3.select(this).remove();
      });

    }

 
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getDimensions() {
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var margin = {top: 20, right: 20, bottom: 40, left: 25};
    var width = screenW + margin.right + margin.left > 600 ? 350 : 200;
    width = width - margin.left - margin.right
    var height = 200 - margin.top - margin.bottom;
    return { 'width' : width, 'height' : height, 'margin' : margin, 'screenW' : screenW, 'screenH' : screenH }
}












