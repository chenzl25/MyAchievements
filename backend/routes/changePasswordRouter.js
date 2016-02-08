//built-in
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');

//middleware
var debug = require('debug')('api:student');

var User = require('../database/data').User;
var tools = require('../lib/tools');
var validator = require('../lib/validator');
var express = require('express');
var router = express.Router();

router.use(tools.checkLoginMiddleware);

router.post('/changePassword',
  tools.validateMiddleware(validator.validateChangePassword.bind(validator)),
  function(req,res) {
    User.changePassword(req.session.userData._id, req.body.oldPassword, req.body.newPassword).then(
      successMessage => res.json({error: false, message:successMessage}),
      errorMessage => res.json({error: true, message: errorMessage})
    )
})

module.exports = router;