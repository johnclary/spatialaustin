
var clicked_feature;
var chart_init = false;
var formatPct = d3.format(".1%");
var legendCollapsed = false;
var legendHeightCollapsed = 40;
var legendWidth = 100;
var legendHeightExpanded;
var legendHtml;

var legendTitle = '<p class="legend-title" ><b>% Single-Family Units Demolished, </b>2000-2017</p>';

var colorScale = d3.scaleSequential(d3.interpolateRdPu)
    .domain([0,.2]);

var x = d3.scaleBand()
          .padding(0.1);

var y = d3.scaleLinear()
          
var layers = {
    stamen_toner_lite: L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
        // attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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

getDimensions();

d3.json('/public/data/austin_tracts.json', function(error, data) {

    d3.json('/public/data/demos_by_year.json', function(error, demos) {

        stuff=[]
        dave=d3.values(demos)
        dave.forEach(function(x) { bill = d3.values(x); bill.forEach(function(y) { stuff.push(y)})});
        // get max demos in any single year (it's onion creek--132)
        // var max_demo = d3.max(d3.values(demos), d => d3.max(d3.values(d)));

        var map = new L.Map('map', map_options);

        var tracts = new L.GeoJSON(data, {
            style: function (feature) {
                var style = getStyle(feature)
                return style;
            },

            onEachFeature: function (feature, layer) {
                
                layer.on('click', function (pt) {
                    var num_demo = feature.properties.num_demo;
                    var pct_demo = '(' + formatPct(feature.properties.pct_demo) + ')';
                    var info = '<b>Single-Family Units Demolished: </br> ' + num_demo +  ' ' + pct_demo + '</b>';
                    var demo_data = demos[feature.properties.FID]

                    if (clicked_feature && clicked_feature == layer) {
                        //  clicked on already-clicked feature
                        //  reset style
                        clicked_feature = null;

                    } else {
                        clicked_feature = layer;    
                    }
                    
                    //  make sure there's data in the clicked feature
                    if (d3.values(demo_data).length > 0) {
                        showChart(demo_data, info);
                    } else {
                        clicked_feature = null;
                    }

                    if (!clicked_feature) {
                        hideInfoPane();
                    }

                    tracts.eachLayer(function(layer_2) {
                        var style = getStyle(layer_2.feature)
                        layer_2.setStyle(style);
                    });

                });
            }
        });

        map.addLayer(layers['stamen_toner_lite'])
            .addLayer(tracts);

        makeLegend(map);
        makeInfoPane(map);

        var screenH = window.innerHeight;
        if (screenH < 600) {
            d3.selectAll('.leaflet-control')
                .style('margin-bottom', '0px')
                .style('margin-right', '0px');
        }   

        var close_button = d3.select('.info-pane')
            .append('div')
            .attr('class', 'info-pane-close');

        d3.select('.info-pane')
            .on('click', function(){
                hideInfoPane();
                clicked_feature = null;                
                tracts.eachLayer(function(layer_2) {
                    var style = getStyle(layer_2.feature)
                    layer_2.setStyle(style);
                });
            });

        close_button.append('a')
            .style('position', 'absolute')
            .style('right', '5px')
            .style('top', '0px')
            .style('cursor', 'pointer')
            .style('font-size', '1.5em')
            .html('x');
    })
        
});


function hideInfoPane() {
    d3.select('.info-pane').style('visibility', 'hidden');
}


function getStyle(feature) {
    var pct = feature.properties.pct_demo;
    var color = colorScale(pct);
    var stroke = false;
    var weight = 0;            
    var fillOpacity = .7;

    if (clicked_feature) {
        if (feature == clicked_feature.feature) {
            fillOpacity = .7;
            stroke = true;
        } else {
            fillOpacity = .2;
        }
    }

    if (isNaN(pct)) {
        color = '#000';
        fillOpacity = 0;
    }

    return {
        color: color,
        stroke: stroke,
        fillOpacity: fillOpacity,
    };
}


function makeLegend(map) {
    // var pos = SMALL_SCREEN ? 'topright' : 'bottomleft';
    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function(map) {

        var div = L.DomUtil.create('div', 'info legend'),
            pcts = [0, 4, 8, 12, 16, 20],
            labels = ['0%', '4%', '8%', '12%','16%', '20%'];
        
        // straight from the leaflet tutorial
        for (var i = 0; i < labels.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorScale(pcts[i]/100) + '"></i> ' +
                labels[i] + (labels[i + 1] ? '&ndash;' + labels[i + 1] + '<br>' : '+');
        }

        attribText = d3.select(div).append("div");
        attribText.append("p")
            .attr("class", "attribText")
            .text("Created by ")
            .append("a")
            .attr("href", '/austin-demolished-neighborhood-trends-visualized/')
            .html("<br><b>S P A T I A L A U S T I N</b>");

        legendHtml = '<div class="legend-wrapper">' + div.innerHTML + '</div>';
        
         div.innerHTML = legendTitle + legendHtml;

        return div;
    };

    legend.addTo(map);

    var close_button = d3.select('.legend')
        .append('span')
        .attr('class', 'legend-close')
    
    d3.select('.legend').on('click', function(){
            collapseLegend(legendCollapsed);
        });

    close_button.append('a')
        .attr('class', 'minimize')
        .style('position', 'absolute')
        .style('right', '5px')
        .style('top', '0px')
        .style('cursor', 'pointer')
        .style('font-size', '1.5em')
        .html('—');

    checkScreen();
};


function collapseLegend(state) {
    if (state) {
        //  expand legend
        legendCollapsed = false;
        d3.select('.legend-title').html(legendTitle);
        d3.selectAll('.legend-wrapper').html(legendHtml);
        d3.select('.minimize').html('—');
    } else {
        legendCollapsed = true;
        d3.selectAll('.legend-wrapper').html('');
        d3.select('.minimize').html('+');
        d3.select('.legend-title').html('Legend');
    }
}


function makeInfoPane(map) {
    
    if (SMALL_SCREEN) {
        var pos = 'topright';
    } else {
        var pos = 'bottomright';
    }
    var infoPane = L.control({position: pos});

    infoPane.onAdd = function(map) {

        var div = L.DomUtil.create('div', 'info-pane');

        div.innerHTML += '<div class="title"></div><div id="chart-wrapper">'
        
        return div;
    };

    infoPane.addTo(map); 

    return infoPane;
};


function showChart(data, info) {
    //  show info pane
    d3.select('.info-pane').style('visibility', 'visible');

    //  hide legend on chart display
    //  d3.select('.legend').style('visibility', 'hidden').style('position', 'absolute');   

    if (!chart_init) {
        makeChart(data, info);
    } else {
        updateChart(data, info);
    }
}


function updateChart(data, info) {
    var dims = getDimensions();
    var demos = d3.values(data);

    d3.select('.title')
        .html(info);

    // append the rectangles for the bar chart
    d3.select('#chart-wrapper')
        .selectAll(".bar")
        .data(demos)
        .transition()
        .attr("height", function(d) { return dims.height - y(d); })
        .attr("y", function(d) { return y(d); })

    d3.select('#chart-wrapper')
        .select('svg')
        .select('g')
        .append("g")
        .attr("class", "axisWhite yAxis")
      .call(d3.axisLeft(y).tickFormat(d3.format("d")));

}


function makeChart(data, info) {
    chart_init = true;

    //  get chart dimensions
    var dims = getDimensions();

    //  update scales
    x.range([0, dims.width])
    y.range([dims.height, 0]);

    //  adjust size of pane to accomodate chart
    d3.select('#chart-wrapper')
        .style('width', (dims.width + dims.margin.left + dims.margin.right + 5) + 'px')

    d3.select('.title')
        .style('max-width', dims.width + 'px')
        .html(info);

    var svg = d3.select('#chart-wrapper')
        .append('svg')
        .attr('class', 'chart')
        .attr('height', dims.height + dims.margin.top + dims.margin.bottom)
        .append('g')
        .attr('transform', 
              'translate(' + dims.margin.left + ',' + dims.margin.top + ')');

    d3.selectAll('.chart')
        .append('text')
        .attr('class', 'axis-title')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 )
        .attr('x', -15 - (dims.height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Units Demolished');
    
    d3.selectAll('.chart')
        .append('text')
        .attr('class', 'axis-title')
        .attr("transform", "translate(" + (dims.width / 2) + " ," + (dims.height + dims.margin.bottom + 20) + ")")
        .text('Year');
    
    var years = d3.keys(data);
    var demos = d3.values(data);

    x.domain(years);

    //  i've hardcoded the y max as 45 because Onion Creek skews the y axis
    //  see commented d3.max usage above calculate the y domain from the data
    y.domain([0,35]);

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
      .attr("class", "axisWhite xAxis")
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      // add the y Axis
    svg.append("g")
        .attr("class", "axisWhite yAxis")
      .call(d3.axisLeft(y).tickFormat(d3.format("d")));

    var ticks = d3.select('.xAxis').selectAll(".tick text");

    ticks.attr("class", function(d,i){
        if (i%4 != 0) d3.select(this).remove();
    });

}


function checkScreen(){
    if (SMALL_SCREEN) {
        legendCollapsed = false;
        collapseLegend(legendCollapsed)
    }
}

function getDimensions() {
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = screenW + margin.right + margin.left > 800 ? 300 : 200;
    width = width - margin.left - margin.right
    var height = screenH + margin.top + margin.bottom > 600 ? 200 : 150;
    var height = height - margin.top - margin.bottom;
    SMALL_SCREEN = screenW < 600 || screenH < 500 ? true : false

    return { 'width' : width, 'height' : height, 'margin' : margin, 'screenW' : screenW, 'screenH' : screenH }
}





