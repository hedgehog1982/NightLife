//function storePic(placeObject) {
exports.storePic = function(placeObject) {
  var url;
  return new Promise(function(resolve, reject) {

    if (typeof placeObject.photos == "undefined") { // no picture, use streetview!
      url = process.env.GStreet + process.env.GApiKey + "&location=" + placeObject.geometry.location.lat + "," + placeObject.geometry.location.lng

    } else { // else use google map pic
      var url = process.env.GpicQuery + placeObject.photos[0].photo_reference;
    }
    //console.log(url);
    var path = "public/images/";
    var extension = ".jpg"
    var filename = path + placeObject.place_id + extension;

    fs.stat(filename, function(err, stat) {
      if (err == null) {
        //  console.log(filename, "exists");
        console.log("got this file already")
        placeObject.pictureFile = "images/" + placeObject.place_id + extension; //dont want public or links dont work;
        resolve(placeObject);
      } else if (err.code == 'ENOENT') {
        console.log("does not exist, getting file")
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
              resolve(placeObject);
            }
          });
        });
        console.log("not Exists");
      }
    });

  });
}

function getMapUrl(mapUrl, requestType) {
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
        if (requestType === "map") {
          resolve(body.results);
        } else {
          console.log("got map request")
          resolve(body);
        }
      })

      result.on('error', function(error) { //if an error
        console.log('ERROR: ' + error.message);
        reject(error)
      });

    });


  })
}

function getTime(results) {
    return new Promise(function(resolve, reject) {
  console.log("getting Time diff", process.env.Tquery);
  if (results.length !== 0) {
    console.log("got some results")
    var location = results[0].geometry.location
    const timeURL = process.env.TURL + process.env.GApiKey + process.env.TQuery + (location.lat + "," + location.lng);
    console.log(timeURL);
    getMapUrl(timeURL)
      .then(function(timeLog) {
        //return new Promise(function(resolve, reject) {
        console.log(Date.now() + (36000 * 1000)) //to get seconds rather
        console.log("######TIME DIFF IS ######", timeLog.rawOffset)
        results.offset = timeLog.rawOffset;
        resolve (results);
      })
    console.log(Date.now() + (36000 * 1000)) //to get seconds rather
  } else {
    resolve (results);  //should be an error?
  }
})
}

function getPictures(result) {
    return new Promise(function(resolve, reject) {
  var promises = []; //multiple promises
  for (var i = 0; i < result.length; i++) {
    result[i].timeOffset = result.offset;
    promises.push(placeDB.findPlace(result[i]));
  }
  console.log("############ length of array is is ", result[0]);
  console.log("url results", result.length)
  resolve( Promise.all(promises))
})

}

function displayResult (resultWithPic, res){
  console.log("got pics");
  res.render('searchResults', {
    placesList: resultWithPic
  });

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

  getMapUrl(mapUrl, "map")
    .then(results => getTime(results))
    .then(result => getPictures(result))
    .then(resultWithPic => displayResult(resultWithPic, res))

}
