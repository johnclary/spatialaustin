var margin = {top: 4, right: 10, bottom: 25, left: 10},
    width = 700 - margin.left - margin.right,
    height = 69 - margin.top - margin.bottom;

var bisectDate = d3.bisector(function(d) { return d.date; }).left; // **

var x = d3.time.scale()
    .domain([new Date(2007, 0, 1), new Date(2015, 4, 1)])
    .range([0, width-20]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxisBottom = d3.svg.axis()
    .scale(x)
    .orient("bottom")
	.tickSize(3);

var xAxisTop = d3.svg.axis()
    .scale(x)
    .orient("top")
	.tickSize(3);
	
var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.demos); });

  //debugging vars
	var dataCheck;
  var xThing;
  var dataz;
  var dateArray;
	var districts;
  var x0;
d3.csv("/public/data/demo-council-month.csv", type, function(error, data) {
	
	//convert m/d/y in date field to to date object
	for (var i = 0; i < data.length; i++) {	var datey = data[i].date;	data[i].date = new Date(datey);}
	dataz = data;
  // Nest data by district.
	districts = d3.nest()
		.key(function(d) { return d.district; })
		.entries(data);

    //i hardcoded the domain values, cuz i'm lazy and i want the y scale the same on each chart..see here for bostocks version: http://bl.ocks.org/mbostock/1157787
  y.domain([0,50]);

	//for assigning unique ids to each graph
  var idCount = 0;
  
  // Add an SVG element for each symbol, with the desired dimensions and margin.
  var svg = d3.select("#container").selectAll("svg")
      .data(districts)
	  .enter().append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("id", function(d) { idCount++; return "district_" + idCount; });

  // Add the area path elements. Note: the y-domain is set per element.
  svg.append("path")
      .attr("class", "area")
      .attr("d", function(d) { return area(d.values); })
	
  // Add a small label for the symbol name.
  svg.append("text")
		.attr("class", "label")	
      .attr("x", 0)
      .attr("y", 0)
      .style("text-anchor", "start")
	  .style("dominant-baseline", "hanging")
      .text(function(d) { return "District " + d.key; });
	
	//Add the axis	
	d3.select("#district_10").append("g").attr("class", "x axis").attr("transform", "translate(0," + (height + 10) + ")").call(xAxisBottom);
	//d3.select("#district_1").append("g").attr("class", "x axis").attr("transform", "translate(0," + (10) + ")").call(xAxisTop);
	
	
	//add <g> for tooltip
	var focus = svg.append("g").style("display", "none");
	
	//add data point highlighter
	focus.append("circle").attr("class", "y").style("fill", "none").style("stroke", "red").style("fill", "red").attr("r", 2);
	focus.append("text").attr("class", "tooltip").style("fill", "red").text("hello");
	
	//Add rect for mouse event listening
	d3.selectAll("svg").append("rect").attr("width", "100%").attr("height", height + 25).style("fill", "none").style("pointer-events", "all") 
		.on("mouseover", function() { focus.style("display", null); })
		.on("mouseout", function() { focus.style("display", "none"); })
		.on("mousemove", mousemove);

	function mousemove() {
		var date = x.invert(d3.mouse(this)[0]);
		var index = 0;
		var  anchorFlag = 0;  //when 0, text-anchor is 'end'
		
		d3.selectAll("circle").attr("cx", function(c) {
				index = bisectDate(c.values, date);
				if (index >= c.values.length-1){ index = c.values.length-1;}
				return x(c.values[index].date);
			})
			.attr("cy", function(c){
				index = bisectDate(c.values, date);
				if (index >= c.values.length-1){ index = c.values.length-1;}
				return y(c.values[index].demos);
			})
		
		d3.selectAll(".tooltip").attr("x", function(c) {
				index = bisectDate(c.values, date);
				if (index >= c.values.length-1){ index = c.values.length-1;}
				return x(c.values[index].date);
			})
			.attr("y",  function(c) {
				index = bisectDate(c.values, date);
				if (index >= c.values.length-1){ index = c.values.length-1;}
				return y(c.values[index].demos) - 10;
			})
			.text(function(q) { 
				index = bisectDate(q.values, date);
				if (x(q.values[index].date) < 40) { 
					d3.selectAll(".tooltip").style("text-anchor", "start")
				} else {
					d3.selectAll(".tooltip").style("text-anchor", "end")
				}
				
				if (index >= q.values.length-1){ index = q.values.length-1;}
				var demos = q.values[index].demos;
				var dateMonth = (q.values[index].date).getMonth() + 1;
				var dateYear = (q.values[index].date).getFullYear();
				return dateMonth + "/" + dateYear + ": " + demos;
			})
		
    }
	
	//Old Event listeners
	//areas = d3.selectAll("svg")
	//areas.on("mouseover", function(d) { d3.select(this).selectAll(".area").transition().style("fill", "red")})
	//areas.on("mouseout", function(d) {  d3.select(this).selectAll(".area").transition().style("fill", "black")})
});

function type(d) {
  d.demos = +d.demos;
  return d;
}