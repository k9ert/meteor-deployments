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

Template.header.depl_count_all = function() {
  return depl_count_all();
}

Template.header.depl_count_selected = function() {
	console.log("found: "+ Deployments.find(search_obj_selected()).count());
  return Deployments.find(search_obj_selected()).count();
}



console.log("We have nof "+ depl_count_selected() + "deployments");
