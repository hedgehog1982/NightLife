var placeSchema = require('../models/places'); // import my mongoose schema
var placesPic = require('../controllers/places')




function findPlace(placeToSearch) {
  return new Promise(function(resolve, reject) {
    var currentDate = new Date();

    placeSchema.findOne({ //do a serach for the place
      place_id: placeToSearch.place_id
    }, function(err, place) {
      if (err) {
        reject(err);
      }
      //console.log("place", '/n', place);

      if (place == null) { // not in DB so add it
        console.log("NOT IN DB!")
        placeToSearch.going = 0; //add 0 to array as it doesnt exist we know its zero
        newPlace(placeToSearch.place_id); //call add function
      } else if (currentDate.getDate() != place.refresh_date.getDate() || currentDate.getMonth() != place.refresh_date.getMonth() || currentDate.getFullYear() != place.refresh_date.getFullYear()) { //older date so outdated update .going to 0      console.log("Current Date  =", currentDate.getDate(), '/n', "Date on DB    =", place.refresh_date.getDate());
        placeToSearch.going = 0;
        console.log("outdated needs amending")
        outDated();
      } else { // today date and in db! fancy bet this happens only during testing
        console.log("in date, amount going is ", place.going)
        placeToSearch.going = place.going;
      }
      resolve(placeToSearch);

      //console.log("read from DB!", placeToSearch, '\n', placeToSearch.place_id) //

    });

  });
}

function outDated() {
  console.log("this is yesterdays, zero it");
  ////////need to amend/////
}

function newPlace(place_id) {
  console.log("writing a new place!")
  var currentDate = new Date();
  placeSchema.create({
    place_id: place_id,
    refresh_date: currentDate,
    going: 0
  }, function(err, instance) {
    if (err) return handleError(err);
    console.log("saved!");
    // saved!
  });
}

function goingPlace() {
  console.log("A person wants to go here")
}

module.exports = {
  findPlace: findPlace
}

exports.getList = function(req, res) {
  //search for twitter id
  //get array of place id
  //return back to browser
};
