function storePic(placeObject) {
  var url;
  return new Promise(function(resolve, reject) {

    if (typeof placeObject.photos == "undefined") { // no picture, use streetview!
      url = process.env.GStreet + process.env.GApiKey + "&location=" + placeObject.geometry.location.lat + "," + placeObject.geometry.location.lng
    } else { // else use google map pic
      var url = process.env.GpicQuery + placeObject.photos[0].photo_reference;
    }
    var path = "public/images/";
    var extension = ".jpg"
    var filename = path + placeObject.place_id + extension;
    fs.stat(filename, function(err, stat) {
      if (err == null) {
        console.log(filename, "exists");
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
        console.log(filename, "not Exists");
      }
    });

  });
}

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
      console.log("############ length of array is is ", result[0]);

      var promises = []; //multiple promises
      for (var i = 0; i < result.length; i++) {
        promises.push(placeDB.findPlace(result[i]));
      }
      console.log("url resuts", result.length)
      Promise.all(promises)
        //do it with one, get it working then do multiple with promises

        .then(function(resultDB) { // not the correct waY!!! pretty sure!
          //console.log("done DB STUFF", result)
          var promises = [];
          for (var i = 0; i < resultDB.length; i++) {
            promises.push(storePic(resultDB[i]));
          }
          console.log("DB resuts", promises.length)
          Promise.all(promises)
            .then(function(resultWithPic) {
              console.log("pic results", resultWithPic.length)
              //console.log("got pics", "/n", resultWithPic);
              res.render('canidothis', {
                placesList: resultWithPic
              });
              //res.send(resultWithPic);
            })
        })
    })

    .catch(function(error) {
      console.log('Error: ' + error)
    })

};
