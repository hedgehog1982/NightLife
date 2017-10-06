var express = require('express');
var router = express.Router();


/*CONTROLLER for places*/
var places_controller = require('../controllers/places');
var login_controller = require('../controllers/login');
//var database_controller = require('../controllers/database')

router.use(login_controller.setUp);

/* GET home page. */
router.get('/', places_controller.getHome);

/*POST a search */
router.post('/search', places_controller.searchPlacePost);

/*twitter login */
router.get("/auth/twitter", login_controller.twitterLogin);

/*twitter callback */
router.get('/auth/twitter/callback', login_controller.twitterCallback);

/*GET list of places where logged in person is going */
// router.get('/getlist', places_controller.getList)

module.exports = router;
