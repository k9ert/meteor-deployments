Deployments = new Meteor.Collection("deployments");

var selected_envs = function() {
  selecteEnvsFunction = function(e) { if (e.selected) return e.name } 
  return (Session.get("envs") ? Session.get("envs") : []).map(selecteEnvsFunction);
}



var depl_count_all = function () {
  return Deployments.find().count();
}

var search_obj_selected = function () {
  return {ts: {$gte: Session.get("fromdate"), $lte : Session.get("todate")}, environment: { $in: selected_envs()}}
}

var depl_count_selected = function () {
  return Deployments.find().count();
}



Template.hello.rendered = function() {
  $('.alert').text("Wait, until the data is loaded. Due to your Network-connection this can take up to 30 seconds ...");
  //$(".alert").alert('close')
}
	
