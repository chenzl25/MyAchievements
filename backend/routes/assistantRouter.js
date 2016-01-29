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
var Assignment = require('../database/data').Assignment;
var Homework = require('../database/data').Homework;
var Review = require('../database/data').Review;

var express = require('express');
var router = express.Router();

router.use(tools.checkLoginMiddleware);
router.use(tools.checkAssistantMiddleware);


router.post('/group/:groupId/student/:studentId/homework/:homeworkId/finalReview', 
	tools.validateMiddleware(validator.validateCreateReview.bind(validator)),
	function(req, res) {
	debug(req.body);
  Homework.assistantFinalReview(req.session.userData._id, req.params.groupId, req.params.studentId, req.params.homeworkId, req.body.message, req.body.score).then(
    homeworkData => res.json({error: false, homeworkData:homeworkData}),
    errorMessage => res.json({error: true, message: errorMessage})
  );
})

module.exports = router;