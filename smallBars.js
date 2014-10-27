// Bar Graph chart is adapted from bar graph tutorials for D3.
// Highlighting and returning to original color of the nodes is done from scratch.
// Tooltip is adapted from a tutorial online for using a vanilla tool-tip.
// Loading gif is dones from scratch.
// Data Loading is done from scratch.

var margin = 80;
var width = 280;
var height = 200;
var appearArray = [];
var data;
var movieArray = [];

var loadImg = d3.select('#movie_data').append("img")
	.attr("src", 'loading.gif')
	.style("opacity", 0);

var tipDiv = d3.select('#movie_data').append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

var actorLabel = d3.select('#movie_data').append("text")
	//.attr("x", (width+margin))
	//.attr("y", -20)
	.style("left", (width/2) )
	.style("top", 790 + "px")
	.style("font-size", "18px")
	.style("font-weight", "bold")
	.style("position", "absolute")
	.style("font-family", "sans-serif")
	.text("");


var svg1 = d3.select('#movie_data').append('svg')
	.attr('class', 'budgetBars')
	.attr('width', width + margin + margin)
	.attr('height', height + margin + margin)
	  .append("g")
	.attr("transform", "translate(" + margin + "," + margin/2 + ")");

svg1.append("text")
	.attr("x", (width/2) - margin/2)
	.attr("y", -16)
	.style("font-size", "16px")
	.style("font-family", "sans-serif")
	.style("font-weight", "bold")
	.text("Budget (in millions)");

svg1.append("path")
	.attr("d", "M0 " + height + " L" + width + " " + height)
	.attr("stroke", "black");
	
var svg2 = d3.select('#movie_data').append('svg')
	.attr('class', 'revenueBars')
	.attr('width', width + margin + margin)
	.attr('height', height + margin + margin)//;
	  .append("g")
	.attr("transform", "translate(" + (margin) + "," + margin/2 + ")");

svg2.append("text")
	.attr("x", (width/2) - margin/2)
	.attr("y", -16)
	.style("font-size", "16px")
	.style("font-family", "sans-serif")
	.style("font-weight", "bold")
	.text("Revenue (in millions)");

svg2.append("path")
	.attr("d", "M0 " + height + " L" + width + " " + height)
	.attr("stroke", "black");
	
var svg3 = d3.select('#movie_data').append('svg')
	.attr('class', 'runtimeBars')
	.attr('width', width + margin + margin)
	.attr('height', height + margin + margin)//;
	  .append("g")
	.attr("transform", "translate(" + margin + "," + margin/2 + ")");

svg3.append("text")
	.attr("x", (width/2) - margin/2)
	.attr("y", -16)
	.style("font-size", "16px")
	.style("font-family", "sans-serif")
	.style("font-weight", "bold")
	.text("Runtime");

svg3.append("path")
	.attr("d", "M0 " + height + " L" + width + " " + height)
	.attr("stroke", "black");
	
var svg4 = d3.select('#movie_data').append('svg')
	.attr('class', 'popularityBars')
	.attr('width', width + margin + margin)
	.attr('height', height + margin + margin)//;
	  .append("g")
	.attr("transform", "translate(" + margin + "," + margin/2 + ")");

svg4.append("text")
	.attr("x", (width/2) - margin/2)
	.attr("y", -16)
	.style("font-size", "16px")
	.style("font-family", "sans-serif")
	.style("font-weight", "bold")
	.text("Popularity");

svg4.append("path")
	.attr("d", "M0 " + height + " L" + width + " " + height)
	.attr("stroke", "black");

svg1.style("opacity", 0);
svg2.style("opacity", 0);
svg3.style("opacity", 0);
svg4.style("opacity", 0);

var x = d3.scale.ordinal()
	
var y = d3.scale.linear()
	.range([height, 0]);
var budgetMax = 0;

var y2 = d3.scale.linear()
	.range([height, 0]);
var revMax = 0;

var y3 = d3.scale.linear()
	.range([height, 0]);
var runMax = 0;

var y4 = d3.scale.linear()
	.range([height, 0]);
var popMax = 0;

// ====================================================================================
// TestCode for running this script alone. To test, just uncomment the following line.
//setMovieData(287, 'Brad Pitt');
//setTimeout(setMovieData(50), 50000);
//setMovieData(50, 'test');
// ====================================================================================

function setMovieData(actorID, actorName)
{
	cleanBars();
	var tempBudget = 0;
	var tempRev = 0;
	var tempRun = 0;
	var tempPop = 0;
	svg1.style("opacity", 0);
	svg2.style("opacity", 0);
	svg3.style("opacity", 0);
	svg4.style("opacity", 0);
	// Show loading graphic here.
	loadImg.style("opacity", 1)
		.style("position", "absolute")
		.style("left", (width) + "px")
		.style("top", (10) + "px");
	
	var api_key = '3d705bef250a99c453f9df413c2bb4ef';
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://api.themoviedb.org/3/person/" + actorID + "/movie_credits?api_key=3d705bef250a99c453f9df413c2bb4ef");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
		//alert('Status: '+this.status+'\nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'\nBody: '+this.responseText);
			data = JSON.parse(this.responseText);
			
			appearArray = data.cast;
			actorLabel.text(actorName + "'s Movie Data");
		}
		var barWidth = width / appearArray.length;
		
		
		for(var i= 0; i< appearArray.length; i++){
			//console.log(appearArray[i].title + " id: " + appearArray[i].id);
			var count = 0;
			var xhr2 = new XMLHttpRequest();
			xhr2.open("GET", "http://api.themoviedb.org/3/movie/" + appearArray[i].id + "?api_key=3d705bef250a99c453f9df413c2bb4ef");
			xhr2.setRequestHeader("Accept", "application/json");
			xhr2.onreadystatechange = function () {
				if (this.readyState == 4) {
					var indexToUse = count;
					count++;
					movieArray[indexToUse] = JSON.parse(this.responseText);
					//console.log("Max Budget Before: " + budgetMax);
					tempBudget = forceToNumber(movieArray[indexToUse].budget);
					tempRev = forceToNumber(movieArray[indexToUse].revenue);
					tempRun = forceToNumber(movieArray[indexToUse].runtime);
					tempPop = forceToNumber(movieArray[indexToUse].popularity);
					//console.log("Test the waters: " + tempBudget);
					if (budgetMax < tempBudget)
						budgetMax = tempBudget;
					if (revMax < tempRev)
						revMax = tempRev;
					if (runMax < tempRun)
						runMax = tempRun;
					if (popMax < tempPop)
						popMax = tempPop;
						
					if (movieArray.length == appearArray.length)
					{
						// Hide Loading graphic here.
						loadImg.style("opacity", 0);
						svg1.style("opacity", 1);
						svg2.style("opacity", 1);
						svg3.style("opacity", 1);
						svg4.style("opacity", 1);
						
						y.domain([0, budgetMax]);
						y2.domain([0, revMax]);
						y3.domain([0, runMax]);
						y4.domain([0, popMax]);
						x.rangeRoundBands([0, width], .05);
						x.domain(movieArray.map(function(d) { return d.title }));
						
						var yAxisForm = d3.svg.axis()
							.tickFormat(function(d) { return d.toString().substr(0, d.toString().length - 6); })
							.scale(y)
							.orient("left");
						var xAxisForm = d3.svg.axis()
							.scale(x)
							.orient("bottom")
						svg1.append("g")
							.attr('class', "y axis")
							//.attr('transform', "translate(90, 0)")
							.call(yAxisForm);
						
						var yAxisForm2 = d3.svg.axis()
							.tickFormat(function(d) { return d.toString().substr(0, d.toString().length - 6); })
							.scale(y2)
							.orient("left");
						svg2.append("g")
							.attr('class', "y axis")
							.call(yAxisForm2);
						
						var yAxisForm3 = d3.svg.axis()
							.scale(y3)
							.orient("left");
						svg3.append("g")
							.attr('class', "y axis")
							.call(yAxisForm3);
						
						var yAxisForm4 = d3.svg.axis()
							.scale(y4)
							.orient("left");
						svg4.append("g")
							.attr('class', "y axis")
							.call(yAxisForm4);
						
						drawBar(movieArray, appearArray.length);
						//var temp = svg1.selectAll("rect")
						//	.attr('fill', 'steelblue');
						//console.log(temp.length);
						
						/*
						var endY = d3.scale.linear()
							.range([height, 0])
							.domain([0, budgetMax]);
						
						svg1.selectAll(".rect")
							.attr("y", function (d) { return endY(d.budget); })
							.attr("height", function(d) { return height - endY(d.budget); });
						*/
					}
					
				}
			};
			xhr2.send(null);
		}
	};
	xhr.send(null);
}

function forceToNumber(inp) {
	inp = +inp;
	return inp;
}

function drawBar(dataPoint, totalNum){
	var barWidth = width / totalNum;
	//var bar = svg1.selectAll("g")
	//	.data(dataPoint)
	//  .enter().append("g")
	//	.attr("transform", function(d,i) {return "translate(" + (margin + (i*barWidth)) + ",0)"; });
	
	//bar.append("rect")
	//	.attr("y", function (d) { return y(d.budget); })
	//	.attr("height", function(d) { return height - y(d.budget); })
	//	.attr("width", barWidth - 1);
	
	var bar = svg1.selectAll(".bar")
		.data(dataPoint)
	  .enter().append("rect")
		.attr("transform", function(d,i) {return "translate(" + (5 + (i*barWidth)) + ",0)"; })
		.attr("y", function (d) { return y(d.budget); })
		.attr("height", function(d) { return height - y(d.budget); })
		.attr("width", barWidth - 2)
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr('fill', 'darkred')
		.on('mouseover', handleMouseOver)
		.on('mouseout', handleMouseOut);
	
	var bar2 = svg2.selectAll(".bar")
		.data(dataPoint)
	  .enter().append("rect")
		.attr("transform", function(d,i) {return "translate(" + (5 + (i*barWidth)) + ",0)"; })
		.attr("y", function (d) { return y2(d.revenue); })
		.attr("height", function(d) { return height - y2(d.revenue); })
		.attr("width", barWidth - 2)
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr('fill', 'darkred')
		.on('mouseover', handleMouseOver)
		.on('mouseout', handleMouseOut);
	
	var bar3 = svg3.selectAll(".bar")
		.data(dataPoint)
	  .enter().append("rect")
		.attr("transform", function(d,i) {return "translate(" + (5 + (i*barWidth)) + ",0)"; })
		.attr("y", function (d) { return y3(d.runtime); })
		.attr("height", function(d) { return height - y3(d.runtime); })
		.attr("width", barWidth - 2)
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr('fill', 'darkred')
		.on('mouseover', handleMouseOver)
		.on('mouseout', handleMouseOut);
	
	var bar4 = svg4.selectAll(".bar")
		.data(dataPoint)
	  .enter().append("rect")
		.attr("transform", function(d,i) {return "translate(" + (5 + (i*barWidth)) + ",0)"; })
		.attr("y", function (d) { return y4(d.popularity); })
		.attr("height", function(d) { return height - y4(d.popularity); })
		.attr("width", barWidth - 2)
		.attr('stroke', 'black')
		.attr('stroke-width', 1)
		.attr('fill', 'darkred')
		.on('mouseover', handleMouseOver)
		.on('mouseout', handleMouseOut);
}

function handleMouseOver(d){
	var trueData = d;
	//console.log(trueData);
	d3.selectAll('rect').select(function(d, i) {
			//console.log(d + " , " + i);
			if (d !== undefined && d.title !== undefined)
				return (d.title.localeCompare(trueData.title) == 0) ? this : null;
			else
				return null;
		})
		.attr('fill', 'whitesmoke');
	
	tipDiv.transition()
		.duration(200)
		.style("opacity", .9);
	
	var sizeVar = d.title.length;
	var sizeDiff = sizeVar - 12;
	if (sizeDiff < 0)
		sizeDiff = 0;
	
	var budgetSize = 28;
	var revenueSize = 28;
	var runtimeSize = 28;
	var popularitySize = 28;
	var popToUse = d.popularity.toPrecision(6);
	
	tipDiv .html("<tipTitle>" + d.title + "</tipTitle>" + "<br/><varName>Budget:</varName><br/>" + d.budget + "<br/><varName>Revenue:</varName><br/>" + d.revenue + "<br/><varName>Runtime:</varName><br/>" + d.runtime + "<br/><varName>Popularity:</varName><br/>" + popToUse)
		.style("width", (60 + sizeDiff + sizeVar/3) + "px")
		.style("height", (30 + budgetSize + revenueSize + runtimeSize + popularitySize + sizeDiff/2 + sizeVar/6) + "px")
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY) + "px");
	
}

var budgetSVGClass = "budgetBars";
var revenueSVGClass = "revenueBars";
var runtimeSVGClass = "runtimeBars";
var popSVGClass = "popularityBars";

function handleMouseOut(d){
	
	var trueData = d;
	
	var temp = d3.selectAll('rect').select(function(d, i) {
		if (d !== undefined && d.title !== undefined)
			return (d.title.localeCompare(trueData.title) == 0) ? this : null;
		else
			return null;
		})
		.attr('fill', function(d, i) { return getBarColor(this.ownerSVGElement.className.animVal); });
	
	tipDiv.transition()
		.duration(500)
		.style("opacity", 0);
}

function getBarColor(svgClass){
	return 'darkred';
	if (svgClass.localeCompare(budgetSVGClass) == 0)
		return 'steelblue';
	else if (svgClass.localeCompare(revenueSVGClass) == 0)
		return 'darkred';
	else if (svgClass.localeCompare(runtimeSVGClass) == 0)
		return 'palegreen';
	else if (svgClass.localeCompare(popSVGClass) == 0)
		return 'orange';
	else
		return 'yellow';
}

function cleanBars()
{
	d3.selectAll('rect').remove();
	d3.selectAll('.y').remove();
}

/* This code is no longer used

function handleMouseOutBudget(d){
	//console.log(this);
	var temp = d3.select(this)
		.attr('fill', 'steelblue');
		
	//console.log(temp);
	//console.log(temp[0][0].ownerSVGElement);
	if (temp[0][0].ownerSVGElement.className.animVal.localeCompare("budgetBars") == 0)
		console.log('success');
}

function handleMouseOutRevenue(d){
	var temp = d3.select(this)
		.attr('fill', 'darkred');
		
	console.log(temp);
}

function handleMouseOutRuntime(d){
	d3.select(this)
		.attr('fill', 'palegreen');
}

function handleMouseOutPopularity(d){
	d3.select(this)
		.attr('fill', 'orange');
}
*/