function mapAndPics(results, callback) {
  console.log(results[0])
  var cleanArray = results.map(function(x) {  ///resulting in not being able to send it back ? build html this side?
    var newArray = [];
    //console.log(results[0]);
    newArray.name = x.name;
    if (typeof x.photos != "undefined") { // see if it exists before I try and access it
      newArray.photoRef = process.env.GpicQuery + x.photos[0].photo_reference; // use this photoReference to get photo was going to cache it but dont need to
    } else {
      newArray.photoRef = "No Photo";
    }
    newArray.address = x.formatted_address;

    return {"name" : newArray.name, "photoRef" : newArray.photoRef, "address" : newArray.address};
  });




  callback (null, cleanArray);
}

// Get home page
var https = require('https'); //for get request to work

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
      //console.log("callback was ", data);
      //  console.log(data[0])
        //res.send(JSON.stringify(data));
        //res.send(data[1]);
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
