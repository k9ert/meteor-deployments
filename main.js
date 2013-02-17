
Deployments = new Meteor.Collection("deployments");



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
	    //myDate = new Date(d.ts.$date ).setMinutes(0); 
	    //d.date = new Date(myDate).setHours(0);
	    d.date = new Date(d.ts.$date).getTime();
	    d.ts = new Date(d.ts.$date); 
	    d.desc = d.environment + "\n" + d.fqdn + "\n" + d.ts + "\n" + d.project+":"+d.version + "\n" + d.result;
	    delete d._id;
	    
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



