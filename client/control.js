


Template.dtp.rendered = function() {
  dp = $('#datetimepicker').datepicker({
      format: 'M dd, yyyy',
      autoclose: true
     });
  dp.on('changeDate', function(ev){
    Session.set("fromdate", ev.date);
    Session.set("envs",null);
    $('#datetimepicker').datepicker('hide');
    $('.dtpif').attr("value", ev.date);
    // doesn't work
    // brush.clear();
  });
  
  dp = $('#datetimepicker2').datepicker({
      format: 'M dd, yyyy',
      autoclose: true
     });
  dp.on('changeDate', function(ev){
    Session.set("todate", ev.date);
    Session.set("envs",null);
    $('#datetimepicker2').datepicker('hide');
    $('.dtpif2').attr("value", ev.date);
    // doesn't work
    // brush.clear();
  });
  
}
  
Template.dtp.fromdate = function () {
  return Session.get("fromdate");	  
}

Template.dtp.todate = function () {
  return Session.get("todate");	  
}

Template.environments.environments = function () {
  if (! Session.get("envs")) {
    console.log("enter");
    data = Deployments.find({ts: {$gte: Session.get("fromdate"), $lte : Session.get("todate")}}).fetch();
    var myEnvHash= {};
    var i=0;
    data.forEach(function(d) {
    		    console.log("sss");
      if (! myEnvHash[d.environment]) {
	myEnvHash[d.environment] = i++;
      }
    });
    var myEnvs = [];
    i=0;
    for (e in myEnvHash) {
      console.log("pushing "+e);
       myEnvs[i++]={name:e,selected:true};
    }
    Session.set("envs",myEnvs);
  }
  return Session.get("envs");	  
}

Template.environments.environments2 = function () {
	console.log("environmengts");
	return [{name:"a","selected":true},{name:"B",selected:false}];
};


Template.environment.selected = function() {
	console.log(JSON.stringify(this));
	return this.selected ? "selected" : "";
	return Session.get("envs")[this.value].selected ? "selected" : "";	
} 

Template.environment.name = function() {
  return this.name;	
}

Template.environment.events({
  'click': function () {
    console.log("clicked "+ JSON.stringify(this));
    envs = Session.get("envs");
    console.log("session "+ JSON.stringify(envs));
    for (e in envs) {
      console.log("process "+ JSON.stringify(e));
      if (envs[e].name === this.name) {
      	console.log("found "+ JSON.stringify(e));
        envs[e].selected = ! envs[e].selected ;
      }
    }
    Session.set("envs",envs);
   }
});
