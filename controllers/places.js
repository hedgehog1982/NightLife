function storePic(placeObject) {
    return new Promise(function(resolve, reject) {
  var url = process.env.GpicQuery + placeObject.photos[0].photo_reference;
  if (typeof placeObject.photos != "undefined") {  //if a picture exists for a place then get file
    console.log("url is ", url);
    var path = "public/images/";
    var extension = ".jpg"
    var filename = path + placeObject.place_id + extension;
    request.get({
      url: url,
      encoding: 'binary'
    }, function(err, response, body) {
      fs.writeFile(filename, body, 'binary', function(err) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("The file was saved!");
          placeObject.pictureFile = "images/" + placeObject.place_id + extension; //dont want public or links dont work;
          resolve (placeObject);
        }
      });
    });
  } else {  //no pic
    placeObject.pictureFile = "No pic"; // need a dummy file ideally
              resolve (placeObject);
  }
});
}

/*function mapAndPics(results, callback) {
  //console.log(results[0])
  console.log("Amount of results are ", results.length)
  var cleanArray = results.map(function(x) {
    var newArray = [];
    var path = "images/";
    var extension = ".jpg"
    //console.log(results[0]);
    newArray.name = x.name;
    if (typeof x.photos != "undefined") { // see if it exists before I try and access it
      newArray.photoRef = path + x.place_id + extension;

      //not going to bother with errors for now
      storePic(process.env.GpicQuery + x.photos[0].photo_reference, "public/" + path, x.place_id, extension, function(err) {
        //put a wait in here before doing callback
        console.log("current errors are ", err)
      }); //messy!!!!! place id doesnt change use this for pic..callback as pic not ready before rendered


    } else {
      newArray.photoRef = "No Photo"; // need to store a temp pic and use that even
    }
    newArray.address = x.formatted_address;

    return {
      "name": newArray.name,
      "photoRef": newArray.photoRef,
      "address": newArray.address
    };
  });
  callback(null, cleanArray);
}*/


function getMapUrl(mapUrl) {
  return new Promise(function(resolve, reject) {
    https.get(mapUrl, function(result) {
      console.log("in get");
      result.setEncoding("utf8");;
      var body = "";

      result.on("data", function(chunk) { //while recieving data add to body
        body += chunk;
      });

      result.on("end", function() { //on end of data
        console.log("recieved end")
        body = JSON.parse(body); //in json format so we can manipulate data
        //console.log("results" , body.results)
        resolve(body.results);
      })

      result.on('error', function(error) { //if an error
        console.log('ERROR: ' + error.message);
        reject(error)
      });

    });


  })
}



// Get home page
var https = require('https'); //for get request to work
var fs = require('fs'); //storing to file system
var request = require('request');
var placeDB = require('../controllers/database.js'); //for database reads

exports.getHome = function(req, res) {
  res.render('index', {
    title: 'Express'
  });
};

// Get places
exports.searchPlacePost = function(req, res) {
  console.log("recieved search", req.body.search);
  const mapUrl = process.env.GURL + process.env.GApiKey + process.env.Gquery + req.body.search;
  console.log("map url is ", mapUrl);

  // get map data  -> check if
  getMapUrl(mapUrl)
    .then(function(result) {
      placeDB.findPlace(result[0]) //do it with one, get it working then do multiple with promises
        .then(function(result) { // not the correct waY!!! pretty sure!
          console.log("done DB STUFF", result)
          storePic(result)
            .then(function (resultWithPic){
              console.log("got a Pic")
            })
        })
    })

    .catch(function(error) {
      console.log('Error: ' + error)
    })

};
