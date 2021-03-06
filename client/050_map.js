


/*  
  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");

    }
  });
*/


// some mappings
// color
var colormapping = function (d) {
	return d.result == "OK" ? "green" : d.result == "WARNING" ? "yellow" : d.result == "ERROR" ? "red" : "blue"; 
}
// description
var descmapping = function (d) {
  return d.environment + "\n" + d.fqdn + "(" + d.fqdnid + ")\n" + d.ts + "\n" + d.project+":"+d.version + "\n" + d.result + "\n" + new Date(d.ts).getTime();
}	


var brush;

Template.map.rendered = function() {

	// copied ... reason?!
	this.node = this.find('#screen');
 
	var margin = {top: 10, right: 110, bottom: 100, left: 180},
	    margin2 = {top: 430, right: 110, bottom: 20, left: 180},
	    width = $("#outer").width() - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom,
	    height2 = 500 - margin2.top - margin2.bottom;
	 
	var parseDate = d3.time.format("%b %Y").parse;
	 
	var x = d3.time.scale().range([0, width]),
	    x2 = d3.time.scale().range([0, width]),
	    y = d3.scale.ordinal().rangePoints([height, 0]),
	    y2 = d3.scale.linear().range([height2, 0]);
	 
	var xAxis = d3.svg.axis().scale(x).orient("bottom"),
	    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
	    yAxis = d3.svg.axis().scale(y).orient("left");
	 
	brush = $('g.x.brush').length || d3.svg.brush()
	    .x(x2)
	    .on("brush", brush);
	 
	var area = d3.svg.area()
	    .interpolate("monotone")
	    .x(function(d) { return x(d.date); })
	    .y0(height)
	    .y1(function(d) { return y(d.fqdnid); });
	 
	var area2 = d3.svg.area()
	    .interpolate("monotone")
	    .x(function(d) { return x2(d.date); })
	    .y0(height2)
	    .y1(function(d) { return y2(d.price); });
	 
	var svg = d3.select("#screen")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom);
	 
	/*svg.append("defs").append("clipPath")
	    .attr("id", "clip")
	  .append("rect")
	    .attr("width", width)
	    .attr("height", height); */ 
	 
	var focus = $("#focus").length || svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .attr("id","focus");
	    
	var text = $("#text").length || svg.append("g")
	    .attr("id","text")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	 
	var context = $("#context").length || svg.append("g")
	    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")")
	    .attr("id","context");
	

	    
	self.drawsomestuff = Meteor.autorun(function() {
	  
	  data = Deployments.find(search_obj_selected()).fetch();
	  var myServerHash= {};
	  var i = 0;
	  myServerHash[""] = i++; // don't want to have anything on the axis
	  
	  data.forEach(function(d) {
	    if (! myServerHash[d.fqdn]) {
	      myServerHash[d.fqdn] = i++;
	    }
	    d.fqdnid = myServerHash[d.fqdn];
	  });
	 
	  yAxis.tickValues(d3.keys(myServerHash));
	  	 
	  x.domain(d3.extent(data.map(function(d) { return (new Date(d.ts).getTime()) })));
	  y.domain(data.map(function(d) { return d.fqdnid; }));
	  x2.domain(x.domain());
	  y2.domain(y.domain());
	  
	  	
	  focus.select(".y.axis").remove();
	  focus.append("g")
	      .attr("class", "y axis")
	      .call(yAxis);
	  
	  // probably Not very performant ...
	  focus.select(".x.axis").remove();
	  var xaxisc = focus.append("g")
	      .attr("class", "x axis")
	      //.attr("id","xaxisc")
	      .attr("transform", "translate(0," + height + ")")
	  
	  xaxisc.call(xAxis);
	  
	  // First create new elements and position them at the bottom
	  text.selectAll("text")
	  	.data(data, function(d) { return d._id; })
	  	.enter().append("circle")
	  	.style("stroke", "grey")
	  	.style("fill", colormapping)
	  	.attr("r", 4)
	  	.attr("height", 3)
	  	.attr("width", 3)
	  	.attr("cy",height+margin.bottom)
	  	//.attr("cx", function(d) { return x(d.date); })
	  	.append("svg:title")
	  	.text(function(d) { return descmapping(d) });
	 
	 // Now position all elements, new and existing ones properly
	 text.selectAll("circle")
	        .data(data, function(d) { return d._id; })
	        .transition()
	  	.duration(700)
	  	.style("fill", colormapping)
	  	.attr("cx", function(d) { return x(new Date(d.ts).getTime()); })
	  	.attr("cy", function(d) { return y(d.fqdnid-0.5);});
	  	

	  // ... and at the same time fade out the no longer needed ones
	  text.selectAll("circle")
	  	.data(data, function(d) { return d._id; })
	  	.exit()
	  	.transition()
	  	.duration(700)
	  	.attr("cy",height+margin.bottom)
	  	.remove(); 
 
	  // For some reason this approach does not work for xaxis2:
	  //var xaxis2c = context.select(".x.axis2")[0][0] || 
	  context.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height2 + ")")
	      .call(xAxis2);
	 
	  context.select(".x.brush")[0][0] || context.append("g")
	      .attr("class", "x brush")
	      .call(brush)
	      .selectAll("rect")
	      .attr("y", -6)
	      .attr("height", height2 + 7);
	});
 
	
	
  function brush() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    /* focus.select("path").attr("d", area); */
    focus.select(".x.axis").call(xAxis);
    


  	
    /*text.selectAll("text")
	.attr("x",function(d) { return x(d.date); })
	.attr("y",function(d) { return y(d.fqdnid  ); })
	.attr("dy",".71em")
	// Rotating does not help so much
	//.attr("transform",function(d) { return "rotate(-90 "+ x(d.date) + "," + y(d.fqdnid)+")"; })
	.text(function(d) { return d.desc; });*/
  
    text.selectAll("circle")
	.attr("cx", function(d) { return x(new Date(d.ts).getTime()); })
	.attr("cy", function(d) { return y(d.fqdnid);})

  } 

  }
