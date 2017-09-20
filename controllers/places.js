// Get home page
exports.getHome = function(req, res) {
    res.render('index', { title: 'Express' });
};

// Get
exports.searchPlacePost = function(req, res) {
  console.log("recieved search" , req.body.search);
  //const MapUrl = process.env.GURL + process.env.GApiKey;
  res.send('POST request to the homepage '); // for sending back to frontend
};
