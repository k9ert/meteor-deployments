
Deployments = new Meteor.Collection("deployments");



if (Meteor.isClient) {
	
  Template.hello.greeting = function () {
    return "Welcome! We have "+Deployments.find().count()+" deployments to explore";
  };

  Template.datetimepicker.rendered=function() {
    $('div.datetimepicker').datepicker({
        format: 'M dd, yyyy',
        autoclose: true
       });
  }
  
  Template.datetimepicker.fromdate = function () {
    return Session.get("fromdate");	  
  }
  
  Template.datetimepicker.events({
    'enter': function () {
      Session.set("fromdate",text);
   } });

  
  Template.environments.environments = function () {
    var allDepls = Deployments.find().fetch();
    var allEnv = [];
    allDepls.forEach( function(d) {
     if (allEnv.indexOf(d.environment) < 0) {
       allEnv.push(d);
     }
     //console.log(allEnv);
     return allEnv;
    } );
  };
/*  
  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");

    }
  });
*/

// Many of this stuff is copied from 
// http://www.benmcmahen.com/blog/posts/50eb57d55a94d35262000001


Template.map.rendered = function() {

	// copied ... reason?!
	this.node = this.find('#screen');
 
	var margin = {top: 10, right: 10, bottom: 100, left: 180},
	    margin2 = {top: 430, right: 10, bottom: 20, left: 180},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom,
	    height2 = 500 - margin2.top - margin2.bottom;
	 
	var parseDate = d3.time.format("%b %Y").parse;
	 
	var x = d3.time.scale().range([0, width]),
	    x2 = d3.time.scale().range([0, width]),
	    y = d3.scale.ordinal().rangeBands([height, 0]),
	    y2 = d3.scale.linear().range([height2, 0]);
	 
	var xAxis = d3.svg.axis().scale(x).orient("bottom"),
	    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
	    yAxis = d3.svg.axis().scale(y).orient("left");
	 
	var brush = d3.svg.brush()
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
	 
	var focus = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	    
	var text = svg.append("g")
	    .attr("id","text")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	 
	var context = svg.append("g")
	    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
	

	    
	self.drawsomestuff = Meteor.autorun(function() {
	  data = Deployments.find().fetch();
	  var i = 1;
	  var myServerHash= {};
	  data.forEach(function(d) {
	    if (! myServerHash[d.fqdn]) {
	      console.log(d.fqdn);
	      myServerHash[d.fqdn] = i++;
	    }
	    d.fqdnid = myServerHash[d.fqdn];
	  });
	 
	  yAxis.tickValues(d3.keys(myServerHash));
	  	 
	  x.domain(d3.extent(data.map(function(d) { return d.date; })));
	  y.domain(data.map(function(d) { return d.fqdnid; }));
	  x2.domain(x.domain());
	  y2.domain(y.domain());
	  
	  focus.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);
	  
	 
	  /*focus.append("path")
	      .datum(data)
	      .attr("clip-path", "url(#clip)")
	      .attr("d", area); */
	  
	  text.selectAll("text")
	  	.data(data)
	  	.enter().append("circle")
	  	.style("stroke", "gray")
	  	.style("fill", "white")
	  	.attr("r", 4)
	  	.attr("cx", function(d) { return x(d.date); })
	  	.attr("cy", function(d) { return y(d.fqdnid);})
	  	.attr("height", 3)
	  	.attr("width", 3)
	  	.attr("x", function(d) { return x(d.date); })
	  	.attr("y", function(d) { return y(d.fqdnid);})
	  	.append("svg:title")
	  	.text(function(d) { return d.desc; });; 
	  	
	  	
	  /*text.selectAll("text")
	  	.data(data)
	  	.enter().append("text")
	  	.attr("x",function(d) { return x(d.date); })
	  	.attr("y",function(d) { return y(d.fqdnid); })
	  	.attr("dy",".71em")
	  	// Rotating does not help so much
	  	//.attr("transform",function(d) { return "rotate(-90 "+ x(d.date) + "," + y(d.fqdnid)+")"; })
	  	.text(function(d) { return d.desc; });*/  
	  

	 
	  focus.append("g")
	      .attr("class", "y axis")
	      .call(yAxis);
	 
	  /* context.append("path")
	      .datum(data)
	      .attr("d", area2); */
	 
	  context.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height2 + ")")
	      .call(xAxis2);
	 
	  context.append("g")
	      .attr("class", "x brush")
	      .call(brush)
	    .selectAll("rect")
	      .attr("y", -6)
	      .attr("height", height2 + 7);
	});
	

	//d3.json("/deployments.json", drawstuff);

	  
	
	
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
	    	.style("stroke", "gray")
	  	.style("fill", "white")
	  	.attr("r", 4)
	  	.attr("cx", function(d) { return x(d.date); })
	  	.attr("cy", function(d) { return y(d.fqdnid);})
	  	.attr("height", 3)
	  	.attr("width", 3)
	  	.attr("x", function(d) { return x(d.date); })
	  	.attr("y", function(d) { return y(d.fqdnid);}); 

} 



  }


  
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Deployments.find().count() === 0) {
    	    Meteor.http.get("http://puppi-deployments.meteor.com/deployments.json", function(error,results){
	  var i = 1;
	  console.log(i);
	  var myServerHash= {};
	  JSON.parse(results.content).forEach(function(d) {
	    if (! myServerHash[d.fqdn]) {
	      myServerHash[d.fqdn] = i++;
	    }
	    d.fqdnid = myServerHash[d.fqdn];
	    // normalize the timestamp:
	    myDate = new Date(d.ts.$date ).setMinutes(0);
	    d.date = new Date(myDate).setHours(0);
	    d.desc = d.project+":"+d.version;
	    delete d._id;
	    d.ts = new Date(d.ts.$date); 
	    Deployments.insert(d);
	  });
	});
    }
  });
      // We should turn off autopublish sooner or later
  /* Meteor.publish("deployments", function () {
   console.log("new client, let's publish+"+Deployments.find().count());
   
   return Deployments.find(); // everything
  } ); */
}



