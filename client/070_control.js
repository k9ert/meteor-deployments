

Template.dtp.rendered = function() {
 
  // Just create it once
  if (!this.dp_created) {
  
    this.dp = $('#datetimepicker').datepicker({
      format: 'dd-MM-yyyy',
      autoclose: true
     });

     
    this.dp.on('changeDate', function(ev){
      Session.set("fromdate", ev.date);
      Session.set("envs",null);
      $('.dtpif').attr("value", ev.date);
      // doesn't work
      // brush.clear();
    });
    this.dp.datepicker('setDate', new Date(2012,11,11));
    $('.dtpif').attr("value", new Date(2012,11,11));


    
    // -------------------------------------------
    
    this.dp2 = $('#datetimepicker2').datepicker({
      format: 'M dd, yyyy',
      autoclose: true
     });
   
    this.dp2.on('changeDate', function(ev){
      Session.set("todate", ev.date);
      Session.set("envs",null);
      $('#datetimepicker2').datepicker('hide');
      $('.dtpif2').attr("value", ev.date);
      
      // doesn't work
      // brush.clear();
    });
    this.dp2.datepicker('setDate', new Date(2013,11,11));
    $('.dtpif2').attr("value", new Date(2013,11,11));


    this.dp_created=true;
  }
  
  /* dp.on('click', function(ev){
    ev.show();
  } */
  
}
  
Template.dtp.fromdate = function () {
  return Session.get("fromdate");	  
}

Template.dtp.todate = function () {
  return Session.get("todate");	  
}


