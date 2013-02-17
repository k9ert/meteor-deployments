Template.dtp.rendered = function() {
  dp = $('#datetimepicker').datepicker({
      format: 'M dd, yyyy',
      autoclose: true
     });
  dp.on('changeDate', function(ev){
    Session.set("fromdate", ev.date);
    $('#datetimepicker').datepicker('hide');
    $('.dtpif').attr("value", ev.date);
  });
  
}
  
Template.dtp.fromdate = function () {
  return Session.get("fromdate");	  
}
