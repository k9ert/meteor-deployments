Deployments = new Meteor.Collection("deployments");

Template.hello.rendered = function() {
$('.alert').text("This is the alert div");	
}
	
Template.hello.greeting = function () {
  return "Welcome! We have "+Deployments.find().count()+" deployments to explore";
};

Session.set("datepicker_unset", 1);
Template.dtp.rendered = function() {
  if (Session.get("datepicker_unset")) {
  dp = $('#datetimepicker').datepicker({
      format: 'M dd, yyyy',
      autoclose: true
     });
  dp.on('changeDate', function(ev){
    Session.set("fromdate", ev.date);
    $('#datetimepicker').datepicker('hide');
  });
  /*dp.on('click', function(ev){
    $('#datetimepicker').datepicker('show');
  });*/
  //Session.set("datepicker_unset", 0);
  }
  
}
  
Template.dtp.fromdate = function () {
  return Session.get("fromdate");	  
}

/*
Session.set("datepicker_unset", 1);
Template.dtp.events({
  'click #datetimepicker': function (event) {
        $('#alert').text("test");
        if (Session.get("datepicker_unset")) {
            $(event.target).datepicker({
              format: 'M dd, yyyy',
              autoclose: true
            });
            Session.set("datepicker_unset", 0);
        }
        //$(event.target).datepicker('update');
        Session.set("fromdate", event.target.value);
   },
   'changeDate #datetimepicker': function (event) {
     alert("changeDate triggered");	   
   }
});
*/
  
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
Template.map.deployments = function() {
  return Deployments.find().fetch();
}

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
	 
	var brush = $('g.x.brush').length || d3.svg.brush()
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
	  data = Deployments.find({ts: {$gte: Session.get("fromdate")}}).fetch();
	  var i = 1;
	  var myServerHash= {};
	  data.forEach(function(d) {
	    if (! myServerHash[d.fqdn]) {
	      console.log(d.fqdn);
	      myServerHash[d.fqdn] = i++;
	    }
	    d.fqdnid = myServerHash[d.fqdn];
	  });
	 
	  yAxis.tickValues(null);
	  
	  yAxis.tickValues(d3.keys(myServerHash));
	  	 
	  x.domain(d3.extent(data.map(function(d) { return d.date; })));
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
	  
	 
	  /*focus.append("path")
	      .datum(data)
	      .attr("clip-path", "url(#clip)")
	      .attr("d", area); */
	  
	  text.selectAll("text")
	  	.data(data)
	  	.exit()
	  	.transition()
	  	.duration(1000);
	  	//.remove(); 
	      
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
	  


	 
	  /* context.append("path")
	      .datum(data)
	      .attr("d", area2); */
	 
	  // For some reason this approach does not work for xaxis2:
	  //var xaxis2c = context.select(".x.axis")[0][0] || 
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
