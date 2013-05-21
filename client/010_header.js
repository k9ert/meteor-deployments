
Template.header.depl_count_all = function() {
  return depl_count_all();
}

Template.header.depl_count_selected = function() {
	console.log("found: "+ Deployments.find(search_obj_selected()).count());
  return Deployments.find(search_obj_selected()).count();
}


Template.header.rendered = function () {
  $('#info').hide();
  console.log("broser_link "+ $('#browser_link'));
  $('#browser_link').click(function() {
    $('#info').hide();
    $('#browser').show();
    $(".active").removeClass("active");
    $(this).addClass("active");
  }); 
  $('#about_link').on( "click", function( event ) {
    console.log("info_link clicked");
    $('#browser').hide();
    $('#info').show();
    $(".active").removeClass("active");
    $(this).addClass("active");
  });
	
}
