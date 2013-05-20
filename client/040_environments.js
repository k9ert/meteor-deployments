
Template.environments.rendered = function() {
  if (! Session.get("envs")) {
  	  console.log("session dates are : " +  Session.get("fromdate") + Session.get("todate"));
    data = Deployments.find({ts: {$gte: Session.get("fromdate"), $lte : Session.get("todate")}}).fetch();
    var myEnvHash= {};
    var i=0;
    data.forEach(function(d) {
      if (! myEnvHash[d.environment]) {
	myEnvHash[d.environment] = i++;
      }
    });
    var myEnvs = [];
    i=0;
    for (e in myEnvHash) {
       myEnvs[i++]={name:e,selected:true};
       $("#env-"+e).button('toggle')	
    }
    Session.set("envs",myEnvs);
  }
  console.log("session envs is "+ JSON.stringify(Session.get("envs")));
  return Session.get("envs")
}
