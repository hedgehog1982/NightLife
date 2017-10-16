var placeSchema = require('../models/places'); // import my mongoose schema
var placesPic = require('../controllers/places')

exports.getList = function(req, res) {

  var currentDate = new Date();



  placeSchema.find({ //do a serach for the place
    going: req.session.twitUser.id,

  }, 'place_id -_id', function(err, places) { //only return place_id
    if (err) {
      reject(err);
    }
    //console.log(places)
    var justIDs= places.map(function (aplace){

      return aplace.place_id;
    })

    res.send({"name" : req.session.twitUser.displayName, "data" :justIDs});
  })
}



/*FIND A PLACE in database work out wether its new and needs adding or not*/
exports.findPlace = function(placeToSearch) {
  return new Promise(function(resolve, reject) {
    var currentDate = new Date();
    var newerDate = Date.now();
    console.log("using new date ", currentDate.getHours());
    //console.log("using date now ", newerDate.getHours());

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
        outDated(place, currentDate);
      } else { // today date and in db! fancy bet this happens only during testing
        console.log("in date, amount going is ", place.going.length)
        placeToSearch.going = place.going.length;
      }
      placesPic.storePic(placeToSearch)
        .then(function (resultWithPic){
          resolve(placeToSearch);
        })


      //console.log("read from DB!", placeToSearch, '\n', placeToSearch.place_id) //

    });

  });
}

/*OUTDATED place, no update in over a day. Needs going zeroing and refresh date updating*/
function outDated(place,currentDate) {
  console.log("this is yesterdays, zero it");
  console.log(place);

     placeSchema.findByIdAndUpdate(place._id, { $set: {
       refresh_date: currentDate,
       going : []
     }}, {
       new: true  //returns updated doc not original
     }
       , function (err, place) {
       if (err) return handleError(err);
       console.log("updated : ", place)
     });

}

/*NEWPLACE is to be added to database */
function newPlace(place_id) {
  console.log("writing a new place!")
  var currentDate = new Date();
  placeSchema.create({
    place_id: place_id,
    refresh_date: currentDate//,
    //going: ;
  }, function(err, instance) {
    if (err) return handleError(err);
    console.log("saved!");
    // saved!
  });
}

/*IWANTTOGO indicates a person has clicked on the place, need to decide if the going or not going*/
exports.iWantToGo = function (req, res) {
  var action; //what I am doing on database
  console.log("A person wants to go here", req.body.id );
  console.log("I need to ", req.body.todo , " it")

  if ( req.body.toDo == "add"){ //sure i can do this with a variable (to $pullAll and addtoset) but wont let me
    console.log("adding");
    placeSchema.findOneAndUpdate(
      {place_id: req.body.id},
      {$addToSet: {
        going : req.session.twitUser.id //twitter id
      }}
      ,function (err){
        if(err) {
          console.error('ERROR!', err);
        }
        res.send("added to database!");
  });
  } else {
    console.log("removing")
    placeSchema.findOneAndUpdate(
      {place_id: req.body.id},
      {$pull: {
        going : req.session.twitUser.id //twitter id
      }}
      ,function (err){
        if(err) {
          console.error('ERROR!', err);
        }
          res.send("Removed from database!");
  });

  }




}
