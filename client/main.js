
Session.set("envs",null);
Session.set("fromdate",new Date(2012,11,12));
Session.set("todate", new Date(2013,11,12));
console.log("Welcome! We have "+Deployments.find().count()+" deployments to explore");
//Meteor.deps.flush();

function checkData() { 
  if (Deployments.find().count() == 0) {
  	  console.log("reschedule");
    setTimeout(checkData, 1000);
  } else {
    Session.set("envs",null);
    $(".alert").alert('close');
}
}

setTimeout(checkData, 1000);



 
