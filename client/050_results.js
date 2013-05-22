
Template.results.rendered = function() {
  console.log("entered results.rendered: " + JSON.stringify(myResultHash));
  if (! Session.get("results")) {
    
    var myResultHash= [
    	    {"name": "OK", "selected":true},
            {"name":"WARNING", selected:true},
            {"name":"ERROR",selected:true}];
    console.log("session result set: " + JSON.stringify(myResultHash));
    Session.set("results",myResultHash);
  }
  return Session.get("results")


}


Template.results.selected = function() {
  return this.selected ? "selected" : "";
} 


Template.results.events({
  'click': function (event) {
    console.log("clicked "+ event.target.id);
    
    results = Session.get("results");
    for (e in results) {
      if (results[e].name === event.target.id) {
        results[e].selected = ! results[e].selected ;
      }
    }
    Session.set("results",results);
    console.log("#env"+  this.name);
    $("#env-"+this.name).button('toggle')	
   }
});
