function storePic(url, path, photoRef, extension, callback){
    console.log("url is ", url);
    var filename = path + photoRef + extension;
    request.get({url: url, encoding: 'binary'}, function (err, response, body) {
    fs.writeFile(filename, body, 'binary', function(err) {
    if(err){
      console.log(err);
      callback(err);
    } else{

      console.log("The file was saved!");
      callback (null);
    }
  });
});
}

function mapAndPics(results, callback) {
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
      storePic(process.env.GpicQuery + x.photos[0].photo_reference, "public/" + path, x.place_id, extension,function (err){
        //put a wait in here before doing callback
            console.log("current errors are ", err)
      });  //messy!!!!! place id doesnt change use this for pic..callback as pic not ready before rendered


    } else {
      newArray.photoRef = "No Photo";  // need to store a temp pic and use that even
    }
    newArray.address = x.formatted_address;

    return {"name" : newArray.name, "photoRef" : newArray.photoRef, "address" : newArray.address};
  });
  callback (null, cleanArray);
}



// Get home page
var https   = require('https'); //for get request to work
var fs      = require('fs'); //storing to file system
var request = require('request');

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


  https.get(mapUrl, function(result) {
    console.log("in get");
    result.setEncoding("utf8");;
    var body = "";

    result.on("data", function(chunk) { //while recieving data add to body
      body += chunk;
    });

    result.on("end", function() { //on end of data
      body = JSON.parse(body); //in json format so we can manipulate data
      mapAndPics(body.results, function (err, data){ //maps to a new array and passes back

      }).then(function(){
        res.render('canidothis',{
          placesList : data
        });
      })

    })

    result.on('error', function(error) { //if an error
      console.log('ERROR: ' + error.message);
    });

  });

  //res.send(mapUrl); // for sending back to frontend
};
