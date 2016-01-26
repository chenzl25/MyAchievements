var mongoose = require('mongoose');
var crypto = require('crypto');
var tools = require('../lib/tools');
var debug = require('debug')('api:User');

ObjectId = mongoose.Schema.Types.ObjectId;

var ClassSchema = new mongoose.Schema({
  name: {type:String,default: null},
  groupsId: [ObjectId],
  assignmentsId: [ObjectId],
  teachersId: [ObjectId],
});

var GroupSchema = new mongoose.Schema({
  classId: {type: ObjectId, default: null},
  name : {type:String,default: null},
  assistantsId: [ObjectId],
  studentsId: [ObjectId]
});

var UserSchema = new mongoose.Schema({
  account: {type:String,default: null,index:true},
  password: {type:String,default: null},
  email: {type:String,default: null},
  name: {type: String, default: null},
  position: {type: String, default: null}, // teaccher, student, assistant
  homeworks: [ObjectId],
  classId: {type: ObjectId, default: null},  // only for the teacher, because the teacher don't belong to any group
  groupId: {type: ObjectId, default: null},  // for student and assistant
});

var AssignmentSchema = new mongoose.Schema({
  name : {type:String,default: null},
  state: {type:String,default: null},
  link: {type:String, default: null},
  from: {type:Number,default: Date.now},
  end: {type:Number,default: Date.now},
  homeworksId: [ObjectId],
  // classId: {type: ObjectId, default: null},
})

var HomeworkSchema = new mongoose.Schema({
  ownerId: {type:ObjectId, default: null},
  assignmentId: {type:ObjectId, default: null},
  github: {type:String,default: null},
  source: {type:String,default: null}, 
  message: {type:String,default: null},
  image: {type: String, default: null},
  reviewsId: [ObjectId]
});

var ReviewSchema = new mongoose.Schema({
  reviewerId: {type: ObjectId, default: null},
  bereviewerId: {type: ObjectId, default: null},
  homeworkId: {type: ObjectId, default: null},
  message: {type: String, default: null},
  score: {type: Number, default: null},
});

ClassSchema.set('autoIndex', false);
GroupSchema.set('autoIndex', false);
UserSchema.set('autoIndex', false);
AssignmentSchema.set('autoIndex', false);
HomeworkSchema.set('autoIndex', false);
ReviewSchema.set('autoIndex', false);

//gobal--------------------------------------------------------------
function detectUserExist(userData) {
  debug(userData);
  return userData? Promise.resolve(userData) : Promise.reject('该用户不存在');
}
function detectClassExist(classData) {
	debug(classData);
	return classData? Promise.resolve(classData) : Promise.reject('该班级不存在');
}
function detectGroupExist(groupData) {
	debug(groupData);
	return groupData? Promise.resolve(groupData) : Promise.reject('该小组不存在');
}
function detectAssignmentExist(assignmentData) {
	debug(assignmentData);
	return assignmentData? Promise.resolve(assignmentData) : Promise.reject('该班级作业不存在');
}
function detectHomeworkExist(homeworkData) {
	debug(homeworkData);
	return homeworkData? Promise.resolve(homeworkData) : Promise.reject('该同学作业不存在');
}
function detectReviewExist(reviewData) {
	debug(reviewData);
	return reviewData? Promise.resolve(reviewData) : Promise.reject('该同学评审不存在');
}
function hash(password) {
  return crypto.createHash('sha1')
               .update(password)
               .digest('base64');
}
function errFilter(err, finalErrorMessage) {
  if (typeof err === 'string')
    finalErrorMessage = err;
  finalErrorMessage = err   // use this to debug
  return Promise.reject(finalErrorMessage)
}
//-------------------------------------------------------------------

//Class--------------------------------------------------------------
  //method
ClassSchema.methods.beforeDeleteClass = function() {
  var groupsId = this.groupsId;
  var teachersId = this.teachersId;
  var groupsDeletedPromise = groupsId.map(
    groupId => Group.delete(groupId)
  )
  var teachersDeletedPromise = teachersId.map(
    teacherId => User.findTeacherById(teacherId)
                     .then(teacherData => teacherData.updateProperty({classId: null}))
                     .then(teacherData => teacherData.save())
  )
  return Promise.all(groupsDeletedPromise.concat(teachersDeletedPromise))
                .then(
                  () => this,
                  (err) => errFilter(err, '删除班级失败')
                )
}
  //static
ClassSchema.statics.findById = function(classId) {
	return Class.findOne({_id: classId})
							.then(classData => detectClassExist(classData));
}
ClassSchema.statics.create = function(className) {
  return Class({name:className})
          .save()
          .then(
            (classData) => Promise.resolve(classData),
            (err) => {
              debug(err);
              return Promise.reject('创建班级失败');
            }
           )
}
ClassSchema.statics.addTeacher = function(classId, teacherId) {
  var outsideClass
  return Class.findById(classId)
              .then(classData => detectClassExist(classData))
              .then(classData => {
                outsideClass = classData;
                return User.findTeacherById(teacherId);
              })
              .then(teacherData => teacherData.updateProperty({classId: outsideClass._id}))
              .then(teacherData => teacherData.save())
              .then(teacherData => {
                outsideClass.teachersId.push(teacherData._id);
                return outsideClass.save();
              })
              .then(
                classData => classData,
                err => errFilter(err, '添加教师失败')
              )
}
ClassSchema.statics.delete = function(classId) {
  return Class.findById(classId)
              .then(classData => classData.beforeDeleteClass())
              .then(classData => Class.remove({_id: classData._id}))
              .then(
                removeResult => {
                  if (removeResult.result.ok == 1 && removeResult.result.n == 1) {
                    return Promise.resolve('成功删除班级');
                  } else {
                    return Promise.reject('删除班级失败,该班级不存在')
                  }
                },
                err => errFilter(err, '删除班级失败')
              )
}
//-------------------------------------------------------------------

//Group--------------------------------------------------------------
  //methods
GroupSchema.methods.removeMember = function(memberId) {
  this.studentsId = this.studentsId.filter(v => v != memberId);
  this.assistantsId = this.assistantsId.filter(v => v != memberId);
  return Promise.resolve(this);
}
GroupSchema.methods.addStudent = function(studentId) {
  this.studentsId.push(studentId);
  return Promise.resolve(this);
}
GroupSchema.methods.addAssistant = function(assistantId) {
  this.assistantsId.push(assistantId);
  return Promise.resolve(this);
}
GroupSchema.methods.updateProperty = function(updater) {
  for (key in updater) {
    this[key] = updater[key];
  }
  return Promise.resolve(this);
}
GroupSchema.methods.beforeDeleteGroup = function() {
  var membersId = [];
  membersId = membersId.concat(this.studentsId);
  membersId = membersId.concat(this.assistantsId);
  membersData = membersId.map(
    memberId => User.findById(memberId)
                    .then(memberData => memberData.updateProperty({groupId: null}))
                    .then(memberData => memberData.save())
  );
  return Promise.all(membersData)
                .then(
                  () => this,
                  (err) => errFilter(err, '删除小组失败')
                )
}
  //statics
GroupSchema.statics.findById = function(groupId) {
  return Group.findOne({_id: groupId})
              .then(groupData => detectGroupExist(groupData));
}
GroupSchema.statics.create = function(classId, groupName) {
	var outsideClass;
	var outsideGroup;
	return Class.findById(classId)
							.then(classData => {
								outsideClass = classData;
								return Group({name: groupName}).save()
							})
							.then(groupData => {
								outsideGroup = groupData;
								outsideClass.groupsId.push(groupData._id);
								return outsideClass.save();
							})
              .then(
                classData => {
                  outsideGroup.classId = classData._id;
                  return outsideGroup.save();
                }
              )
							.then(
                ()=>outsideGroup,
                err => errFilter(err, '创建小组失败')
              )
}
GroupSchema.statics.addStudent = function(groupId, studentId) {
  var outsideGroup
  return Group.findById(groupId)
              .then(groupData => {
                outsideGroup = groupData;
                return User.findStudentById(studentId);
              })
              .then(studentData => studentData.updateProperty({groupId: outsideGroup._id}))
              .then(studentData => studentData.save())
              .then(studentData => outsideGroup.addStudent(studentData._id))
              .then(groupData => groupData.save())
              .then(
                groupData => groupData,
                err => errFilter(err, '添加学生失败')
              )
}
GroupSchema.statics.addAssistant = function(groupId, assistantId) {
  var outsideGroup
  return Group.findById(groupId)
              .then(groupData => {
                outsideGroup = groupData;
                return User.findAssistantById(assistantId);
              })
              .then(assistantData => assistantData.updateProperty({groupId: outsideGroup._id}))
              .then(assistantData => assistantData.save())
              .then(assistantData => outsideGroup.addAssistant(assistantData._id))
              .then(groupData => groupData.save())
              .then(
                groupData => groupData,
                err => errFilter(err, '添加助教失败')
              )
}
GroupSchema.statics.deleteMember = function(groupId, memberId) {
  var outsideGroup;
  return Group.findById(groupId)
              .then(groupData => {
                outsideGroup = groupData;
                return User.findById(memberId);
              })
              .then(userData =>  userData.updateProperty({'groupId': null}))
              .then(userData => userData.save())
              .then(userData => outsideGroup.removeMember(memberId))
              .then(groupData => groupData.save())
              .then(
                groupData => groupData,
                err => errFilter(err, '删除学生失败')
              )
}
GroupSchema.statics.delete = function(groupId) {
  return Group.findById(groupId)
              .then(groupData => groupData.beforeDeleteGroup())  // So sorry I dont't want to make it commit or rollback
              .then(groupData => Group.remove({_id: groupData._id}))
              .then(
                removeResult => {
                  if (removeResult.result.ok == 1 && removeResult.result.n == 1) {
                    return Promise.resolve('成功删除小组');
                  } else {
                    return Promise.reject('删除小组失败,该小组不存在')
                  }
                },
                err => errFilter(err, '删除小组失败')
              )
}
//-------------------------------------------------------------------



//User---------------------------------------------------------------
  // method****
UserSchema.methods.updateProperty = function(updater) {
  for (key in updater) {
    this[key] = updater[key];
  }
  return Promise.resolve(this);
}
  // static****
UserSchema.statics.findById = function(userId) {
  return User.findOne({_id: userId})
              .then(userData => detectUserExist(userData));
}
UserSchema.statics.checkUserPoistion = function(userData, position) {
  if (userData.position === position)
    return Promise.resolve(userData);
  return Promise.reject({innerMessage:'not match the position'});
}
UserSchema.statics.findTeacherById = function(teacherId) {
  return User.findById(teacherId)
             .then(userData => User.checkUserPoistion(userData, 'teacher'))
             .then(              
              userData => userData,
              err => errFilter(err, '该教师不存在')
            )
}
UserSchema.statics.findStudentById = function(studentId) {
  return User.findById(studentId)
             .then(userData => User.checkUserPoistion(userData, 'student'))
             .then(              
              userData => userData,
              err => errFilter(err, '该学生不存在')
            )
}
UserSchema.statics.findAssistantById = function(assistantId) {
  return User.findById(assistantId)
             .then(userData => User.checkUserPoistion(userData, 'assistant'))
             .then(              
              userData => userData,
              err => errFilter(err, '该助教不存在')
            )
}

UserSchema.statics.register = function (account, password, name,email, position) {
    
  return  this.find({account:account})
              .count()
              .then(
                (number) => number === 0 ?
                              User({account: account, password: hash(password), name: name, email:email, position: position}).save()
                            : Promise.reject('账号已被注册')
              )
              .then(
                userData => userData,
                err => errFilter(err, '注册失败')
              )
};
UserSchema.statics.login = function (account, password) {
  return  this.findOne({account:account, password: hash(password)}, {password:0})
              .then(userData => detectUserExist(userData))
              .then(
                userData => userData,
                err => Promise.reject('账号或密码错误')  // special we don't use the errFilter
              )
};
UserSchema.statics.delete = function (account) {
    return this.remove({account: account}).then(
	    (removeResult) => {
	    	if (removeResult.result.ok == 1 && removeResult.result.n == 1) {
	    		return Promise.resolve('成功删除用户')   //need to delete all the things coresponsed to that user
	    	} else {
	    		return Promise.reject('删除用户失败,该用户不存在')
	    	}
	    },
      err => errFilter(err, '删除用户失败')
	  )
};

//-------------------------------------------------------------------


var Class = mongoose.model('Class', ClassSchema);
var Group = mongoose.model('Group', GroupSchema);
var User = mongoose.model('User', UserSchema);
var Assignment = mongoose.model('Assignment', AssignmentSchema);
var Homework = mongoose.model('Homework', HomeworkSchema);
var Review = mongoose.model('Review', ReviewSchema);

module.exports.Class = Class;
module.exports.Group = Group;
module.exports.User = User;
module.exports.Assignment = Assignment;
module.exports.Homework = Homework;
module.exports.Review = Review;