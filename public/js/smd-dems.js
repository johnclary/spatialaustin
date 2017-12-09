var margin = {top: 0, right: 0, bottom: 0, left: 0};
var w = 680 - margin.left - margin.right;
var h = 530 - margin.top - margin.bottom;
var outerWidth = w + margin.left + margin.right;
var outerHeight = h + margin.left + margin.right; 
var xPadding = 20;
var yPadding = 100;
var lgH = 40; //legend height and width
var lgW = 20;
var nClasses = 6; //# of classes in legend

var dataList = ["pop2012", "pctWht", "pctAfrAm", "pctHisp", "pctAsian", "pctOther", "grocery", "parkAcres", "nonCitizenPct"] //hardcode your different demographic types here
var dataChoice = "pop2012" //default

var strkColor = "white";
var strkWidth = 2;
var colorScale = ["#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]; //ig using colorbrewer, must equal number of classes in scale
var color = d3.scale.quantile().range(["#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);//make sure your range value does not exceed the number of swatches in that particular scale (if you are using colorbrewer). you spent 3 hours diagnosing this problem on aug 3, 2014.
var quantiles = [];

var formatInt = d3.format("0,000"); //adds commas to thousands
var formatPct = d3.format(".1%");

var dropDown = d3.select("p").append("select")  //data values must match json variable names data
dropDown.append("option").attr("value", "pop2012").text("2012 Population");
dropDown.append("option").attr("value", "pctWht").text("% White");
dropDown.append("option").attr("value", "pctAfrAm").text("% African American");
dropDown.append("option").attr("value", "pctHisp").text("% Latino");
dropDown.append("option").attr("value", "pctAsian").text("% Asian");        

var projection = d3.geo.albers()
    .translate([w/2, h/2])
    .scale([75000])
    .parallels([34.25, 40.25])
    .rotate([96, 0])
    .center([-1.82, 30.31]); //lower lon = move left; lower lat, move up

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/public/data/district_data.csv", function(dataset) { //load csv data
    color.domain([
                    d3.min(dataset, function(d) { return d[dataChoice]; }),
                    d3.max(dataset, function(d) { return d[dataChoice]; })
                ]);
    quantiles.push.apply(quantiles, color.quantiles()); //generates array of color quantiles for legend 
    quantiles.push(0); //extends the range of the classes with a dummy '0' so that the we can add the highest class to the legend
    //Load in GeoJSON dataset
    d3.json("/public/data/smd_simplified.json", function(json) {
        //Merge the dataset and GeoJSON
        //Loop through once for each dataset value
        for (var i = 0; i < dataset.length; i++) {
            //Grab district name
            var dataFid = dataset[i].fid; 
            //Grab dataset value, and convert from string to float. (csv dataset is always read-in as a string)
            var pop2012 = parseFloat(dataset[i].pop2012);
            var pctWht = parseFloat(dataset[i].pctWht);
            var pctAfrAm = parseFloat(dataset[i].pctAfrAm);
            var pctHisp = parseFloat(dataset[i].pctHisp);
            var pctAsian = parseFloat(dataset[i].pctAsian);
            //match up the fids from the csv and json
            for (var j = 0; j < json.features.length; j++) { 

                var jsonFid = json.features[j].properties.FID;

                if (dataFid == jsonFid) {
                    //Copy the dataset value into the JSON
                    json.features[j].properties.pop2012 = pop2012;
                    json.features[j].properties.pctWht = pctWht;
                    json.features[j].properties.pctAfrAm = pctAfrAm;
                    json.features[j].properties.pctHisp = pctHisp;
                    json.features[j].properties.pctAsian = pctAsian;
                    //Stop looking through the JSON
                    break;
                }
            }
        }	
        legend(); //draws the legend
        //Bind dataset and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features) 
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke-width", strkWidth)
            .attr("stroke", strkColor)
            .attr("fill", function(d) {
                var dataColor = d.properties[dataChoice];  //retrieves data value accroding to selected dataChoice
                return color(dataColor); //add retreives color based on dataChoice value, assigning outpt to dataColor
            })

            .on("mouseover", function(d) {
                dataColor = d3.select(this).attr("fill"); //get the fill of the moused-over element	
                svg.append("path") //and append a new outline of the path over the shape (because otherwise edges overlap)
                    .attr("d", d3.select(this).attr("d"))
                    .attr("id", "pathSelection")
                    .attr("stroke", "white")
                    .attr("fill", "none")
                    .transition()
                    .duration(150)
                    .attr("stroke-width", 3)
                    .attr("stroke", function(d) { //and the outline color is a darker version of the original fill
                        return d3.rgb(dataColor).darker(.4);
                    });
            })
            .on("mouseenter", function(d){ //tooltip!	
                d3.select(this)
                    .on("mousemove", function(d){
                        d3.select("#tooltip")
                          .select("#valueA")
                          .text("District: # " + d.properties.FID);
                        d3.select("#tooltip")
                              .select("#valueB")
                              .text("Population: " + formatInt(d.properties.pop2012));
                        d3.select("#tooltip")
                            .select("#valueC")
                            .text("White: " + formatPct(d.properties.pctWht));
                        d3.select("#tooltip")
                            .select("#valueD")
                            .text("African American: " + formatPct(d.properties.pctAfrAm));
                        d3.select("#tooltip")
                            .select("#valueE")
                            .text("Latino: " + formatPct(d.properties.pctHisp));
                        d3.select("#tooltip")
                            .select("#valueF")
                            .text("Asian: " + formatPct(d.properties.pctAsian));
                        d3.select("#tooltip").classed("hidden", false);//Show the tooltip
                    })	
            })

            .on("mouseleave", function(){ //hide tooltip
                d3.select("#tooltip").classed("hidden", true);
            })
            .on("mouseout", function(d) { //remove temp objects and return opacity to normal					
                d3.select("#pathSelection").remove();
            });
        d3.select("select") //drop-down menu responder
            .on("change", function() {
                dataChoice = d3.event.target.value;  //grabs value from menu option
                color.domain([ //rescales color domain
                    d3.min(dataset, function(d) { return d[dataChoice]; }),
                    d3.max(dataset, function(d) { return d[dataChoice]; })
                ]);						
                svg.selectAll("path") //redraws geoJSON paths with new fills
                    .data(json.features) 
                    .transition()
                    .ease("linear")
                    .duration(500)
                    .attr("d", path)
                    .attr("stroke-width", strkWidth)
                    .attr("stroke", strkColor)
                    .attr("fill", function(d) {
                        var dataColor = d.properties[dataChoice];  //retrieves data value accroding to selected dataChoice
                        return color(dataColor); //add retreives color based on dataChoice value, assigning outpt to dataColor
                    });
                quantiles = [];
                quantiles.push.apply(quantiles, color.quantiles()); //refreh array of color quantiles for legend 
                quantiles.push(0);  //and extend length of array by adding dummy '0'
                legendUpdate();
            });
        });
});

function legend() { //creates legend rectangles based on color scale
// to rotate legend text: d3.selectAll(".legend_text").transition().duration(1000).attr("transform", function() { x = d3.select(this).attr("x"); y = d3.select(this).attr("y"); return "rotate( -15 " + x + " " + y + ")" })
svg.selectAll("body")
    .data(colorScale)
    .enter()
    .append("rect")
    .attr("class", "legend")
    .attr("height", lgH)
    .attr("width", lgW)
    .attr("x", xPadding)
    .attr("y", function(d, i) {
        return h - (i * lgH) - lgH; 
    })
    .attr("id", function(d){
        id = d.replace("#","_");
        return id;
    })
    .attr("fill", function(d) { return d; })
    .attr("stroke-width", strkWidth)
    .attr("stroke", strkColor);
svg.selectAll("body")
    .data(quantiles)
    .enter()
    .append("text")
    .attr("class", "legend_text")
    .text( function(d, i) { //genius math
        if (i == 0) {   //bottom quantile
            var high = formatInt(d3.round(quantiles[i], -3) - 1);
            return 0 + " - " + high;
            }
        if (i == nClasses - 1) { //highest quantile
            var low = formatInt(d3.round(quantiles[i-1], -3));
            return low + "+";
        }
        else { //all the others
            var low = formatInt(d3.round(quantiles[i-1], -3)); //negative digit in format argument rounds to neares thousand. 
            var high = formatInt(d3.round(quantiles[i], -3) - 1);
            }
        return low + " - " + high;
    })
    .attr("x", xPadding * 2.1)
    .attr("y", function(d, i) { return (h - (lgH/2)) -  (i * lgH) })
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "gray")
    .attr("text-anchor", "right")
};

function legendUpdate() {
    svg.selectAll(".legend_text")
        .remove();		
    svg.selectAll("body")
        .data(quantiles)
        .enter()
        .append("text")
        .attr("class", "legend_text")
        .text( function(d, i) {
            if (quantiles[0] > 1) { //format as non-[percent]
                //genius math
                if (i == 0) {   //bottom quantile
                    var high = formatInt(d3.round(quantiles[i], -3) - 1);
                    return 0 + " - " + high;
                    }
                if (i == nClasses - 1) { //highest quantile
                    var low = formatInt(d3.round(quantiles[i-1], -3));
                    return low + "+";
                }
                else { //all the others
                    var low = formatInt(d3.round(quantiles[i-1], -3)); //negative digit in format argument rounds to neares thousand. 
                    var high = formatInt(d3.round(quantiles[i], -3) - 1);
                    return low + " - " + high;
                }
            }
            else { //format as percent
                if (i == 0) {
                    var high = formatPct(quantiles[i]-.001); //subtraction prevents interclas overlap on legend
                    return 0 + " - " + high;
                }

                if (i == nClasses - 1) { //highest quantile
                    var low = formatPct(quantiles[i-1]);
                    return low + "+";
                }
                else { //all others
                    var low = formatPct(quantiles[i-1]);
                    var high = formatPct(quantiles[i] - .001);
                    return low + " - " + high;
                }
            };
        })
        .attr("x", xPadding * 2.1)
        .attr("y", function(d, i) { return (h - (lgH/2)) -  (i * lgH) })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "gray")
        .attr("text-anchor", "right")
        .attr("fill", "black");
}