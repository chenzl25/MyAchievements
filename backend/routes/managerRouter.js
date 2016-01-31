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

router.post('/Mregister', tools.validateMiddleware(validator.validateMRegister.bind(validator)), function(req, res) {
	debug(req.body);
  User.register(req.body.account, req.body.password, req.body.name, req.body.email, 'manager').then(
    userData => res.json({error: false, userData:userData}),
    errorMessage => res.json({error: true, message: errorMessage})
  );	
})

router.use(tools.checkLoginMiddleware);
router.use(tools.checkManagerMiddleware);

router.post('/register', tools.validateMiddleware(validator.validateRegister.bind(validator)), function(req, res) {
	debug(req.body);
  User.register(req.body.account, req.body.password, req.body.name, req.body.email, req.body.position).then(
    userData => res.json({error: false, userData: userData}),
    errorMessage => res.json({error: true, message: errorMessage})
  );	
})
router.post('/class',tools.validateMiddleware(validator.validateCreateClass.bind(validator)),function(req, res) {
	debug(req.body);
	Class.create(req.body.name).then(
		classData => res.json({error: false, classData: classData}),
    errorMessage => res.json({error: true, message: errorMessage})
	)
});
router.post('/class/:classId/teacher/:teacherId',function(req, res) {
  debug(req.body);
  Class.addTeacher(req.params.classId,req.params.teacherId).then(
    classData => res.json({error: false, classData: classData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
});
router.post('/class/:classId/group',tools.validateMiddleware(validator.validateCreateGroup.bind(validator)),function(req, res) {
	debug(req.body);
	Group.create(req.params.classId,req.body.name).then(
		groupData => res.json({error: false, groupData: groupData}),
    errorMessage => res.json({error: true, message: errorMessage})
	)
});

router.post('/group/:groupId/student/:studentId',function(req, res) {
  debug(req.body);
  Group.addStudent(req.params.groupId, req.params.studentId).then(
    groupData =>  res.json({error: false, groupData: groupData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
});
router.post('/group/:groupId/assistant/:assistantId',function(req, res) {
  Group.addAssistant(req.params.groupId, req.params.assistantId).then(
    groupData =>  res.json({error: false, groupData: groupData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
});
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
router.get('/classs', function(req, res) {
  Class.find({}).then(
    classsData => res.json({error: false, classsData: classsData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
})
router.get('/groups', function(req, res) {
  Group.find({}).then(
    groupsData => res.json({error: false, groupsData: groupsData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
})
router.get('/groups', function(req, res) {
  Group.find({}).then(
    groupsData => res.json({error: false, groupsData: groupsData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
})
router.get('/users', function(req, res) {
  User.find({}).then(
    usersData => res.json({error: false, usersData: usersData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
})
router.delete('/user/:userAccount', function(req, res) {
  debug(req.body);
  User.delete(req.params.userAccount).then(
    successMessage => res.json({error: false, message:successMessage}),
    errorMessage => res.json({error: true, message: errorMessage})
  );  
})
router.delete('/group/:groupId/member/:memberId', function(req, res) {
  Group.deleteMember(req.params.groupId, req.params.memberId).then(
    groupData => res.json({error: false, groupData: groupData}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
})
router.delete('/group/:groupId', function(req, res) {
  Group.delete(req.params.groupId).then(
    successMessage => res.json({error: false, message:successMessage}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
})
router.delete('/class/:classId', function(req, res) {
  Class.delete(req.params.classId).then(
    successMessage => res.json({error: false, message:successMessage}),
    errorMessage => res.json({error: true, message: errorMessage})
  )
})

module.exports = router;