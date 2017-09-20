var express = require('express');
var router = express.Router();

/*CONTROLLER for places*/
var places_controller = require('../controllers/places');


/* GET home page. */
router.get('/', places_controller.getHome);

/*POSt a search */
router.post('/search', places_controller.searchPlacePost);

module.exports = router;
