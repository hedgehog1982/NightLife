//not in use yet
var Twitter = require("node-twitter-api"); //for twitter login

var twitter = new Twitter({   //new twitter
    consumerKey: process.env.TWITKEY,
  consumerSecret: process.env.TWITSECRET,
  callback: process.env.TWITCALLBACK
});

	var newrequestSecret;  // secret passsed back from twitter

  exports.twitterLogin = function(req, res) {  //requet a token and store
    console.log(twitter.login)
      twitter.getRequestToken(function(err, requestToken, requestSecret) {
          if (err)
              res.status(500).send(err);
          else {
              newrequestSecret = requestSecret;
              console.log(requestSecret);
              console.log(requestToken);
              res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
          }
      });
  };

  exports.twitterCallback = function (req, res) {  //once its passed to twitter recieve callback with oauth_token and auth_verifier
        var oauth_token = (req.query.oauth_token);  //easier way? ()
        var oauth_verifier = req.query.oauth_verifier;

        twitter.getAccessToken(oauth_token, newrequestSecret, oauth_verifier, function(err, accessToken, accessSecret) {
        if (err)
            res.status(500).send(err);
        else
            twitter.verifyCredentials(accessToken, accessSecret, function(err, user) {
                if (err)
                    res.status(500).send(err);
                else
                    //console.log(user); //store the details we need
                    req.session.twitUser.id = user.id;
                    req.session.twitUser.token = accessToken;
                    req.session.twitUser.username =  user.screen_name;
                    req.session.twitUser.displayName= user.name;
                    console.log(req.session.twitUser);  //just so i can see the output for now
                    res.send("logged in"); //redirect back to home page
                });
        });
};
