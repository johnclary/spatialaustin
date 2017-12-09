var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

var margin = {top: 0, right: 0, bottom: 0, left: 0};
var w = 500 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;
var outerWidth = w + margin.left + margin.right;
var outerHeight = h + margin.left + margin.right; 
var xPadding = 20;
var yPadding = 100;
var lgH = 40; //legend height and width
var lgW = 20;
var nClasses = 11; //# of classes in legend

var dataList = ["rentChange","structureChange","valueChange","incomeChange"] //hardcode your different demographic types here
var dataChoice = "rentChange" //default

var strkColor = "none";
var strkWidth = 1;
var colorScale = [
         d3.rgb(128,0,38).darker(.6),
        "#800026",
        "#bd0026",
        "#e31a1c",
        "#fc4e2a",
        "#fd8d3c",
        "#feb24c",
        "#fed976",
        "#ffeda0",
        "#ffffcc",
        d3.rgb(255,255,204).brighter(.3),
        "white"
]

var distanceCall = ["500","400","350","300","250","200","150","100","75","50","25","0"]

var quantiles = [];

var formatInt = d3.format("0,000"); //adds commas to thousands
var formatPct = d3.format(".1%");

var projection = d3.geo.albers()
    .translate([w/2, h/2])
    .scale([2300])
    .parallels([34.25, 40.25])
    .rotate([96, 0])
    .center([-3.91, 30.90]); //lower lon = move left.

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .call(zoom);

var container = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

d3.json("/public/data/dataRings_84_FINAFINAL.json", function(json) {

    //Bind dataset and create one path per GeoJSON feature
    container.selectAll("path")
        .data(json.features) 
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke-width", strkWidth)
        .attr("stroke", strkColor)
        .attr("fill", function(d) {
            var marker = d.properties.Id;  
            return colorScale[marker]; 
        })

        .on("mouseover", function(d) {
            dataColor = d3.select(this).attr("fill"); //get the fill of the moused-over element
            container.append("path") //and append a new outline of the path over the shape (because otherwise edges overlap)
                .attr("d", d3.select(this).attr("d"))
                .attr("id", "pathSelection")
                .attr("fill", dataColor)
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .transition()
                .duration(50)
                .attr("fill", function(d) { //and the outline color is a darker version of the original fill
                    return d3.rgb(dataColor).darker(.4);
                });
        })
        
        .on("mouseout", function(d) {
            svg.selectAll("#pathSelection")
                .remove()
        })
        
        .on("mouseenter", function(d){ //tooltip!	
            d3.select(this)
                .on("mousemove", function(d){
                    distanceIndex = d.properties.Id
                    distanceIndex = distanceCall[distanceIndex]
                    d3.select("#tooltip")
                        .select("#valueA")
                            .text(formatInt(d.properties.POP100) + " Texans  live more than " + distanceIndex + " miles from a Texas abortion facility")
                    d3.select("#tooltip").classed("hidden", false);//Show the tooltip
                })	
        })

        .on("mouseleave", function(){ //hide tooltip
            d3.select("#tooltip").classed("hidden", true);
        });
});

function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
};