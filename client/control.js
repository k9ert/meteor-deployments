Template.dtp.rendered = function() {
  dp = $('#datetimepicker').datepicker({
      format: 'M dd, yyyy',
      autoclose: true
     });
  dp.on('changeDate', function(ev){
    Session.set("fromdate", ev.date);
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
