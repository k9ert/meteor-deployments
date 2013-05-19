


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
}

Template.environments.environments = function () {

	return Session.get("envs") ? Session.get("envs") : [] ;	  
}

Template.environments.environments2 = function () {
  return [{name:"a","selected":true},{name:"B",selected:false}];
};


Template.environment.selected = function() {
  return this.selected ? "selected" : "";
} 

Template.environment.name = function() {
  return this.name;	
}

Template.environment.rendered = function(e) {
    $('.btn-group').button();
	console.log("#env"+  JSON.stringify(e));
  $("#env-"+this.name).button('toggle')	
}

Template.environment.events({
  'click': function () {
    console.log("clicked "+ JSON.stringify(this));
    
    envs = Session.get("envs");
    for (e in envs) {
      if (envs[e].name === this.name) {
        envs[e].selected = ! envs[e].selected ;
      }
    }
    Session.set("envs",envs);
    console.log("#env"+  this.name);
    $("#env-"+this.name).button('toggle')	
   }
});
