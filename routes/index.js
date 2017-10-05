var express = require('express');
var router = express.Router();

/*CONTROLLER for places*/
var places_controller = require('../controllers/places');
var login_controller = require('../controllers/login');

var newrequestSecret;


/* GET home page. */
router.get('/', places_controller.getHome);

/*POSt a search */
router.post('/search', places_controller.searchPlacePost);

/*twitter login */
router.get("/auth/twitter", login_controller.twitterLogin);

/*twitter callback */
router.get('/auth/twitter/callback', login_controller.twitterCallback);

module.exports = router;
