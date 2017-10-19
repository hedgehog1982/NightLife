var placeSchema = require('../models/places'); // import my mongoose schema
var placesPic = require('../controllers/places')

exports.getList = function(req, res) {

  placeSchema.find({ //do a serach for the place
    going: req.session.twitUser.id,

  }, 'place_id refresh_date offset -_id', function(err, places) { //only return place_id
    if (err) {
      reject(err);
    }
    console.log(places)
    var justIDs =[];  //empty array
    places.forEach(function (aplace){
      //do time check
      var currentDate =new Date (Date.now() +(aplace.offset * 1000));
      console.log("Local Time :", currentDate, "      ", currentDate.getUTCHours(), ":", currentDate.getUTCMinutes());
      console.log(aplace.refresh_date.getUTCDate());
      //if valid in date push id  //using this more than pnce, should be a function !!!!Refactor this bad boy
      if (currentDate.getUTCDate() != aplace.refresh_date.getUTCDate() || currentDate.getUTCMonth() != aplace.refresh_date.getUTCMonth() || currentDate.getUTCFullYear() != aplace.refresh_date.getUTCFullYear() ){
          console.log("outDated");
          outdated(aplace.place_id, currentDate);
      } else {
          justIDs.push(aplace.place_id);
      }
      //else we dont bother


    })

    res.send({"name" : req.session.twitUser.displayName, "data" :justIDs});
  })
}



/*FIND A PLACE in database work out wether its new and needs adding or not*/
exports.findPlace = function(placeToSearch) {
  return new Promise(function(resolve, reject) {
    var currentDate =new Date (Date.now() +(placeToSearch.timeOffset * 1000)); //get local time ?
    var today =new Date ();
    console.log("Local Time :", currentDate, "      ", currentDate.getUTCHours(), ":", currentDate.getUTCMinutes());
    console.log("UTC Time today :", today);


    placeSchema.findOne({ //do a serach for the place
      place_id: placeToSearch.place_id
    }, function(err, place) {
      if (err) {
        reject(err);
      }

      if (place == null) { // not in DB so add it
        console.log("NOT IN DB!")
        placeToSearch.going = 0; //add 0 to array as it doesnt exist we know its zero
        newPlace(placeToSearch.place_id, placeToSearch.timeOffset,  currentDate); //call add function
      } else if (currentDate.getUTCDate() != place.refresh_date.getUTCDate() || currentDate.getUTCMonth() != place.refresh_date.getUTCMonth() || currentDate.getUTCFullYear() != place.refresh_date.getUTCFullYear()) { //older date so outdated update .going to 0      console.log("Current Date  =", currentDate.getDate(), '/n', "Date on DB    =", place.refresh_date.getDate());
        placeToSearch.going = 0;
        console.log(place.refresh_date, " is outdated needs amending ,", currentDate)
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
  console.log("this is yesterdays, zero it", currentDate);
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
function newPlace(place_id, offset, currentDate) {
  console.log("writing a new place!, offset is ", offset )
  placeSchema.create({
    place_id: place_id,
    refresh_date: currentDate,
    offset : offset
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
  console.log("I need to-",req.body.todo, "-it")

  if ( req.body.todo == "add"){ //sure i can do this with a variable (to $pullAll and addtoset) but wont let me
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
