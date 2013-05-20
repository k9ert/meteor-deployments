
Template.environments.rendered = function() {
  if (! Session.get("envs")) {
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
  return Session.get("envs")

}


Template.environments.environments = function () {
  return Session.get("envs") ? Session.get("envs") : [] ;	  
}
