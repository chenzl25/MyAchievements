//built-in
var path = require('path');
var crypto = require('crypto');
//middleware
var debug = require('debug')('api:manager');
//self
var tools = require('../lib/tools');
var validator = require('../lib/validator');
var User = require('../database/data').User;
var Class = require('../database/data').Class;
var Group = require('../database/data').Group;

var express = require('express');
var router = express.Router();

module.exports = router;