//built-in
var path = require('path');
var crypto = require('crypto');
//middleware
var debug = require('debug')('api:teacher');
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
router.use(tools.checkTeacherMiddleware);

// var AssignmentSchema = new mongoose.Schema({
//   name : {type:String,default: null},
//   state: {type:String,default: null},
//   link: {type:String, default: null},
//   from: {type:Number,default: Date.now},
//   end: {type:Number,default: Date.now},
//   homeworksId: [ObjectId],
//   classId: {type: ObjectId, default: null},
// })

router.post('/assignment', tools.validateMiddleware(validator.validateCreateAssignment.bind(validator)), function(req, res) {
	debug(req.body);
  Assignment.create(req.session.userData._id, req.body.name, req.body.link, req.body.from, req.body.end).then(
    assignmentData => res.json({error: false, assignmentData:assignmentData}),
    errorMessage => res.json({error: true, message: errorMessage})
  );
})
// haven't implement
// router.delete('/assignment/:assignmentId', function(req, res) {
//   Assignment.delete(assignmentId).then(
//     successMessage => res.json({error: false, message:successMessage}),
//     errorMessage => res.json({error: true, message: errorMessage})
//   );
// })
router.put('/assignment/:assignmentId',
           tools.validateMiddleware(validator.validateUpdateAssignment.bind(validator)),
           function(req, res) {
  // believe the teacher .... I don't check whether the assignment belong to the teacher
  Assignment.update(req.params.assignmentId, req.body.name, req.body.link, req.body.from, req.body.end).then(
    assignmentData => res.json({error: false, assignmentData:assignmentData}),
    errorMessage => res.json({error: true, message: errorMessage})
  );
})
router.get('/user/:userId', function(req, res) {
  User.findById(req.params.userId).then(
    userData => res.json({error:false, userData: userData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
})
router.get('/class/:classId', function(req, res) {
  Class.findById(req.params.classId).then(
    classData => res.json({error: false, classData: classData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
});
router.get('/group/:groupId', function(req, res) {
  Group.findById(req.params.groupId).then(
    groupData => res.json({error: false, groupData: groupData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
});
router.get('/assignment/:assignmentId', function(req, res) {
  Assignment.findById(req.params.assignmentId).then(
    assignmentData => res.json({error: false, assignmentData: assignmentData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
});
router.get('/homework/:homeworkId', function(req, res) {
  Homework.findById(req.params.homeworkId).then(
    homeworkData => res.json({error: false, homeworkData: homeworkData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
});

//below important
router.post('/homework/:homeworkId/finalReview', 
  tools.validateMiddleware(validator.validateCreateReview.bind(validator)),
  function(req, res) {
  debug(req.body);
  Homework.teacherFinalReview(req.params.homeworkId, req.body.message, req.body.score).then(
    homeworkData => res.json({error: false, homeworkData:homeworkData}),
    errorMessage => res.json({error: true, message: errorMessage})
  );
})
router.put('/assignment/:assignmentId/rank', function(req, res) {
  Assignment.getRank(req.params.assignmentId).then(
    successMessage => res.json({error: false, successMessage:successMessage}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
})
router.get('/assignment/:assignmentId/toReviewHomeworks', function(req, res) {
  User.teacherGetToReviewHomeworks(req.session.userData._id, req.params.assignmentId).then(
    homeworksData => res.json({error: false, homeworksData:homeworksData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
})


module.exports = router;