//built-in
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');

//middleware
var debug = require('debug')('api:student');

var User = require('../database/data').User;
var tools = require('../lib/tools');
var express = require('express');
var router = express.Router();

router.use(tools.checkLoginMiddleware);

router.post('/quit', function(req,res) {
  delete req.session.userData;
  res.json({error: false, message:'退出成功'});
})

module.exports = router;