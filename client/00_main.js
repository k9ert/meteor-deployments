Deployments = new Meteor.Collection("deployments");

var selected_function = function(e) { if (e.selected) return e.name } 

var selected_envs = function() {
  return (Session.get("envs") ? Session.get("envs") : []).map(selected_function);
}

var selected_results = function() {
  return (Session.get("results") ? Session.get("results") : []).map(selected_function);
}


var depl_count_all = function () {
  return Deployments.find().count();
}

var search_obj_selected = function () {
  search_obj = {ts: {$gte: Session.get("fromdate"), $lte : Session.get("todate")}, environment: { $in: selected_envs()}, result: { $in: selected_results()}}
  //console.log(JSON.stringify(search_obj));
  return search_obj;
}

var depl_count_selected = function () {
  return Deployments.find().count();
}



Template.hello.rendered = function() {
  $('.alert').text("Wait, until the data is loaded. Due to your Network-connection this can take up to 30 seconds ...");
  //$(".alert").alert('close')
}
	
