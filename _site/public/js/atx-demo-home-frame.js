
queue()
    .defer(d3.csv, "/public/data/demo-data.csv")
    .await(ready);
	

function ready(error, data) {
	var svg = d3.select("svg").append("rect").attr("width", 700).attr("height", 400).attr("fill", "white").attr("opacity", 0);

	var i = 0;                     //  set your counter to 1
	var j = 0; //index for csv iterating
	imageLoop(i);

	function imageLoop() {
	   setTimeout(function () {    //  call a 3s setTimeout when the loop is called
		  i++;                     //  increment the counter
		  addImage();
		  if (i < 100) {            //  if the counter < 10, the loop happens 10 times
			 imageLoop();             //  ..  again which will trigger another 
		  }                        //  ..  setTimeout()
	   }, 8000)  //time in milliseconds to delay
	}

	function addImage(){
		j = Math.floor((Math.random() * 3500) + 1);  //random number within range of demo list
		var lat = data[j].lat.substr(0,8); 
		var lon = data[j].lon.substr(0,8);
		var permitYear = data[j].permit;
		permitYear = permitYear.substr(0,4); //truncate permit number to capture issue year
		var address = data[j].address;
		var descrption = data[j].description;
		d3.selectAll("rect").attr("opacity", 1);  //cover image container with rectangle
		d3.select("#imageContainer").html("<img class=image title=" + address + " src='http://maps.googleapis.com/maps/api/streetview?size=400x400&location=" + lat + "," + lon + "'/>")
		d3.selectAll("rect").transition().duration(2000).attr("opacity", 0);//reveal image
		d3.select("#address").text(address).style("font-weight", "bold");//add text
		d3.select("#description").text(permitYear + ": " +descrption).style("font-style", "italic");
	}
}