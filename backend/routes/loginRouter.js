//built-in
var path = require('path');
var crypto = require('crypto');
//middleware
var debug = require('debug')('api:registerLogin');
//self
var tools = require('../lib/tools');
var validator = require('../lib/validator');
var User = require('../database/data').User;

var express = require('express');
var router = express.Router();


/* GET home page. */
router.post('/login', tools.validateMiddleware(validator.validateLogin.bind(validator)), function login(req, res) {
  // res.setHeader('Content-type','application/json');
  debug(req.body);
  if (req.session.userData) {
    User.alreadyLogin(req.session.userData.account).then(
      (userData) => {
        debug(userData);
        req.session.userData = userData;
        res.json({error: false, userData: userData});
      },
      (errorMessage) => {
        debug(errorMessage);
        res.json({error: true, message: errorMessage});
      }
    );
  }
  User.login(req.body.account, req.body.password).then(
    (userData) => {
  		debug(userData);
      req.session.userData = userData;
      res.json({error: false, userData: userData});
    },
    (errorMessage) => {
    	debug(errorMessage);
      res.json({error: true, message: errorMessage});
    }
  );
});


module.exports = router;