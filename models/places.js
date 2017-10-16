'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = mongoose.Schema({
    place_id: String,
    refresh_date : Date,
    going : [Number]
});

module.exports = mongoose.model("placeSchema" , placeSchema);
