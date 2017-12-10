
var screenW = window.innerWidth;

var margin = {top: 4, right: 20, bottom: 20, left: 25};

var maxWidth = screenW + margin.right + margin.left > 800 ? 800 : screenW;

var width = maxWidth - margin.right - margin.left;

var height = .7 * width + margin.top + margin.bottom;

var widthPadding = 0;

var barSpaceFactor = .1;

var colorScale =d3.scaleLinear().range([0,1]);

var barColor = "#009999";

var tickNum = 4;

var y = d3.scaleBand()
        .range([0, height])
        .domain([1,2,3,4,5,6,7,8,9,10])  //  10 council districts
        .padding(barSpaceFactor);

var charts = ["hs_exempt_sf_count","pct_hs_exempt_sf","med_market_val", "avg_annual_savings"];

var labels = {
    "hs_exempt_sf_count" : "# of Homes With Exemptions",
    "med_market_val" : "Median Home Value",
    "pct_hs_exempt_sf" : "% of Homes With Exemptions",
    "avg_annual_savings" : "Avg Annual Savings"
}

var showMap = false;

//  create buttons

for (var i = 0; i < charts.length; i++) {

    d3.select("#selectors")
        .append("label")
        .attr("class", function(){
            if (i == 0) {
        
                return "button-selected";
        
            }  else {
                
                return "button-unselected";

            }
        })
        .attr("for", i)
        .text(" " + labels[charts[i]])
        .attr("name", "variable")
        .attr("value", charts[i]);

}
//  

var current_var = charts[0];

var xScaleObj = {};

var formatObj = {
    "hs_exempt_sf_count" : ",.2r",
    "med_market_val" : "$,.2r",
    "pct_hs_exempt_sf" : "0.0%",
    "avg_annual_savings" : "$,.2r"
};

// makeMap("/public/data/smd_simplified.json");

d3.csv("/public/data/atx_hs_exempt_final.csv", function(data) {  

	// compute domain for x scales for each chart. got to be a better way

    for (var i = 0; i < charts.length; i++){    //  create x scale objects 

        var current_scale = d3.scaleLinear()

        if (charts[i].indexOf("pct") >= 0) {
            
            current_scale.domain([1,0]);  //  for a percentage variable use a domain of 0 - 100%  
        
        } else {

            var yMax = d3.max(data, function(d) { return +d[charts[i]]}) * 1;  //  multiply max data value to add 'padding' to the domain

            current_scale.domain([yMax, 0]);
                                
        }

        current_scale.range([width - widthPadding, 0]);

        xScaleObj[charts[i]] = current_scale;

    }

    var svg = d3.select("#container")
        .append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .data(data)
        .attr("class", function(d){
            return d;
        })


    var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", function(d){

            return "bar d" + d.council_district;

        })
        .attr("y", function(d){

            return y(+d.council_district);

        })
        .attr("x", 0)
        .attr("width", function(d) { 

            return xScaleObj[current_var](d[current_var]);

        })
        .attr("height", y.bandwidth())
        .attr("fill", barColor);

    svg.append('g')
        .attr("class", "axis-left")
        .call(d3.axisLeft(y).tickSize(0)
            .tickFormat(function(d){
                return "D" + d;
            })
        );

    svg.append("g")
        .attr("class", "axis-bottom")
        .attr("transform", "translate(" + 0 + "," + height + ")")
        .call(d3.axisBottom(xScaleObj[current_var]).ticks(tickNum).tickFormat(d3.format(formatObj[current_var])).tickSizeOuter(0));


    d3.selectAll("label").on("click touch", function(){

        d3.selectAll(".button-selected").attr("class", "button-unselected");

        d3.select(this).attr("class", "button-selected");
        
        current_var = d3.select(this).attr("value");
        
        updateCharts(current_var);
    
    });

    d3.selectAll(".bar").on('mouseenter touchstart', function(d) {

        d3.select("#tooltip").remove();

        d3.selectAll(".selected").classed("selected", false).attr("fill", barColor);

        var current_color = d3.select(this).attr("fill");

        d3.select(this).classed("selected", true).attr("fill", d3.color(current_color).darker());

        var barHeight = d3.select(".bar").attr("height");

        d3.select(this).attr("fill", d3.color(current_color).darker());
        
        var val = d[current_var];

        var district = d.council_district;
        
        svg.append("text")
            .attr("id", "tooltip")
            .attr("x", 5)
            .attr("y", y(district) + (barHeight*1-5))
            .text(d3.format(formatObj[current_var])(val));
    })

    .on("mouseleave", function(){

        d3.select(this).attr("fill", barColor);

        d3.select("#tooltip").remove();
    });


    function updateCharts(){

        d3.select("#tooltip").remove();

        d3.selectAll(".selected").classed("selected", false).attr("fill", barColor);
        
        svg.selectAll(".bar")
            .transition()
            .duration(500)
            .ease(d3.easeQuadIn)
            .attr("width", function(d) {
                return xScaleObj[current_var](d[current_var]);
            })
            .attr("fill", barColor);

        d3.select(".axis-bottom").remove();

        svg.append('g')
            .attr("class", "axis-bottom")
            .attr("transform", "translate(" + 0 + "," + height + ")")
            .transition()
            .duration(500)
            .ease(d3.easeQuadIn)
            .call(d3.axisBottom(xScaleObj[current_var]).ticks(tickNum).tickFormat(d3.format(formatObj[current_var])).tickSizeOuter(0));

    }

});  //  end d3.csv


function makeMap(json_path){

    d3.json(json_path, function(json) {

        pizza = json;

        var strkWidth = 2;

        var strkColor = "white";

        var pathFill = "gray";

        var projection = d3.geoAlbers()
            .translate([width/2, height/2])
            .scale([75000])
            .parallels([34.25, 40.25])
            .rotate([96, 0])
            .center([-1.76, 30.31]); //lower lon = move left; lower lat, move up


        var path = d3.geoPath()
            .projection(projection);

        var svg = d3.select("#map-container")
            .append("svg")
            .attr("height", 0)  //   height + margin.top + margin.bottom)
            .attr("width", width + margin.left + margin.right)
            .append("g")

        var districts = svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", function(d){
                return "districts d" + d.properties.FID;
            })
            .attr("stroke-width", strkWidth)
            .style("stroke", strkColor)
            .attr("fill", barColor);

        svg.selectAll("text")
            .data(json.features)
            .enter()
            .append("text")
            .attr("class", "district-label")
            .attr("x", function(d){
                var centroid = path.centroid(d);
                if (d.properties.FID == "9" || d.properties.FID == "5") {
                    centroid[0] = centroid[0] - 15;
                }
                return centroid[0];
            })
            .attr("y", function(d){
                var centroid = path.centroid(d);
                return centroid[1];
            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                return "D" + d.properties.FID
            });

        d3.selectAll("#container").on("click", function(){

            if (!showMap) {

                showMap = true;
            
                d3.select("#map-container").select("svg")
                    .transition()
                    .duration(500)
                    .attr("height", height + margin.top + margin.bottom);

            } else {

                showMap = false;

                d3.select("#map-container").select("svg")
                    .transition()
                    .duration(500)
                    .attr("height", 0);

            }

        });


        d3.selectAll(".districts")
            .on("mouseenter", function(d){

                var current_district = d.properties.FID;

                d3.selectAll(".d" + current_district).attr("fill", d3.color(barColor).darker());

            })

            .on("mouseleave", function(d){

                var current_district = d.properties.FID;

                d3.selectAll(".d" + current_district).attr("fill", barColor);

            });



    });  //  end d3.json

}
