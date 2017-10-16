var express = require('express');
var router = express.Router();


/*CONTROLLER for places*/
var places_controller = require('../controllers/places');

/*CONTROLLER for all things login Related*/
var login_controller = require('../controllers/login');

/*CONTROLLER for database reads and write */
var database_controller = require('../controllers/database')

/* Blank login */
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
router.get('/IDlist', database_controller.getList);

/*POST a new Database Entry (post stops refreshing)*/
router.post('/going',database_controller.iWantToGo);

module.exports = router;
