// Get home page
var https = require('https'); //for get request to wokr

exports.getHome = function(req, res) {
  res.render('index', {
    title: 'Express'
  });
};

// Get
exports.searchPlacePost = function(req, res) {
  console.log("recieved search", req.body.search);
  const mapUrl = process.env.GURL + process.env.GApiKey + process.env.Gquery + req.body.search;
  console.log("map url is ", mapUrl)

  https.get(mapUrl, function(res) {
    console.log("in get");
    res.setEncoding("utf8");;
    var body = "";

    res.on("data", function(chunk) { //while recieving data add to body
      body += chunk;
    });

    res.on("end", function() {  //on end of data
      body = JSON.parse(body);  //in json format so we can manipulate data
      console.log(body.results)
      // need to map this to something nicer to manipulate and store on DB (....the DB i havent even set up)

    })

    req.on('error', function(error) { //if an error
      console.log('ERROR: ' + error.message);
    });

  });

  //res.send(mapUrl); // for sending back to frontend
};
