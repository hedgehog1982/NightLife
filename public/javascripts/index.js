var userName = "";
var places = [];

function highlightPlaces() {
  for (var i = 0; i < places.length; i++) {
    $("#" + places[i]).parent().toggleClass("green-border"); //click to say going!
  }
}

function setData(data) {
  //console.log("Have I recieved a greeting? ", data)
  $.get("/IDList", function(data) {
    userName = data.name;
    places = data.data
    console.log(userName, '/n', places);
    highlightPlaces();
    alert("Hello " + userName + ", you are currently going to " + places.length + " places");
  })
  //get ID and list of places
}


$(document).ready(function() {


  //on submit button click
  $("#submit").click(function(event) {
    event.preventDefault();
    var search = $("#search").val();
    console.log(submit)

    $.post("/search", {
      "search": search
    }, function(data) {
      $("#posthtml").replaceWith(data);
      highlightPlaces(); //if logged in and we do a search makes sure its highlighted
      //console.log(data);
    });
  });

  // On opening child window
  $(document).on("click", ".card-img-top", function() {
    console.log("clicked image");
    if (userName.length === 0) { //not logged in yet{
      window.open('./auth/twitter', '_blank');
    } else {
      var todo;
      if (places.indexOf(event.target.id) == -1) { //if its not in array then add
        console.log("Need to add it");
        places.push(event.target.id)
        todo = "add";

      } else {
        places.splice(places.indexOf(event.target.id), 1) // should be doing this after confirmed?
        console.log("Need to remove it");
        todo = "remove";
      }

      console.log(places);
      $(this).parent().toggleClass("green-border"); //click to say going!
      console.log(event.target.id);
      $.post("/going", { // need to toggle this but for now i wont bother
        "id": event.target.id,
        "todo": todo
      }, function(data) {
        console.log(data);

      });

    }
  });




});
