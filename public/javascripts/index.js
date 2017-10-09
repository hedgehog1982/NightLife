userName = "";

function setData(data) {
  //console.log("Have I recieved a greeting? ", data)
  alert("successfully logged in, recieving currently logged in places");
  $.get("/IDList", function(id) {
    userName = id;
    console.log(id);
  })
  //get ID and list of places
}


$(document).ready(function() {
  $("#submit").click(function(event) { //on submit button click
    event.preventDefault();
    var search = $("#search").val();
    console.log(submit)

    $.post("/search", {
      "search": search
    }, function(data) {
      $("#posthtml").replaceWith(data);
      //console.log(data);
    });
  });

  // On opening child window
  $(document).on("click", ".card-img-top", function() {
    console.log("clicked image");
    if (userName = "") { //not logged in yet{
      window.open('./auth/twitter', '_blank');
    } else {
      $( ".card" ).toggleClass( "green-border" )
        //green border indicated going?
        //post to add to database
        //update local array
    }
  });




});
