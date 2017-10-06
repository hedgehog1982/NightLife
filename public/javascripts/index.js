// Variable that holds the handle of the child
function setData(data) {
   //console.log("Have I recieved a greeting? ", data)
   alert("successfully logged in, recieving currently logged in places");
   //get ID and list of places
}


$(document).ready(function() {
    $("#submit").click(function(event) {  //on submit button click
        event.preventDefault();
        var search = $("#search").val();
        console.log(submit)

        $.post("/search", { "search" : search }, function(data) {
          $("#posthtml").replaceWith(data);
              //console.log(data);
          });
        });

   // On opening child window
   $(document).on("click", ".img-thumbnail",function(){
     console.log("clicked image");
   	 window.open('./auth/twitter', '_blank');
   });




});
