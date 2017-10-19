var userName = "";
var places = [];

function highlightPlaces() {
  for (var i = 0; i < places.length; i++) {
    $("#" + places[i]).parent().toggleClass("green-border"); //click to say going!
    var goingText = $("#" + places[i]).siblings(".card-body").children(".going").text(); //click to say going!
    console.log(goingText);
    var goingArray = goingText.split(" ");
    goingArray[goingArray.length-1] = (goingArray[goingArray.length-1] -1) + " + YOU!" ;
    goingText = goingArray.join(" ");
    console.log(goingText);
    $("#" + places[i]).siblings(".card-body").children(".going").text(goingText)

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
    $("button").button("loading");

    $.post("/search", {
      "search": search
    }, function(data) {
      $("#posthtml").replaceWith(data);
      $("#submit").button("reset");
      highlightPlaces(); //if logged in and we do a search makes sure its highlighted
      //console.log(data);
    });
  });

  // On opening child window
  $(document).on("click", ".card-img-top", function() {
          var ID = event.target.id;
    if (userName.length === 0) { //not logged in yet{
      window.open('./auth/twitter', '_blank');
    } else {
      var todo;
      if (places.indexOf(ID) == -1) { //if its not in array then add
        todo = "add";
      } else {
        todo = "remove";
      }

      $(this).parent().toggleClass("green-border"); //click to say going!

      $.post("/going", { // need to toggle this but for now i wont bother
        "id": ID,
        "todo": todo
      }, function(data) {

        if (data == "Removed from database!"){
                  places.splice(places.indexOf(ID), 1) // Remove from array
                  var goingText = $("#" + ID).siblings(".card-body").children(".going").text();
                  $("#" + ID).siblings(".card-body").children(".going").text(goingText.replace(" + YOU!", ""));

        } else if (data == "added to database!"){
          $("#" + ID).siblings(".card-body").children(".going").append(" + YOU!")
          places.push(ID) //add to array
        } else {
          alert("Something went wrong! Please try again");
        }


      });

    }
  });




});
