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
  assistantsId: [ObjectId],  // only one assistantsId
  studentsId: [ObjectId],
  toReviewGroupId: {type: ObjectId, default: null}
});

var UserSchema = new mongoose.Schema({
  account: {type:String,default: null,index:true},
  password: {type:String,default: null},
  email: {type:String,default: null},
  name: {type: String, default: null},
  position: {type: String, default: null}, // teaccher, student, assistant
  homeworksId: [ObjectId],
  // classId: {type: ObjectId, default: null},  // only for the teacher, because the teacher don't belong to any group
  // groupId: {type: ObjectId, default: null},  // for student and assistant
  classsId: [ObjectId],
  groupsId: [ObjectId],   //student has only one groupsId
});

var AssignmentSchema = new mongoose.Schema({
  name : {type:String,default: null},
  state: {type:String,default: 'future'},  // future,present,end
  link: {type:String, default: null},
  from: {type:String,default: Date.now},
  end: {type:String,default: Date.now},
  homeworksId: [ObjectId],
  classsId: [ObjectId],
})

var HomeworkSchema = new mongoose.Schema({
  ownerId: {type:ObjectId, default: null},
  assignmentId: {type:ObjectId, default: null},
  github: {type:String,default: null},
  source: {type:String,default: null}, 
  message: {type:String,default: null},
  image: {type: String, default: null},
  reviewsId: [ObjectId],
  groupRank: {type:String, default: null},
  classRank: {type:String, default: null},
  finalScore: {type:String, default: null},
  finalMessage: {type:String, default: null}
});

var ReviewSchema = new mongoose.Schema({
  reviewerId: {type: ObjectId, default: null},
  beReviewerId: {type: ObjectId, default: null},
  homeworkId: {type: ObjectId, default: null},
  message: {type: String, default: null},
  score: {type: String, default: null},
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
function letEveryElementInArrayChangeIndex(originArray) {
  var changedArray = [];
  for (var i = 0; i < originArray.length; i++)
    changedArray.push(originArray[i]);
  while (!judgeArrayWhetherChangeIndexOk(originArray,changedArray))
    messTheArray(changedArray);
  return changedArray;
}
function judgeArrayWhetherChangeIndexOk(originArray,changedArray) {
  for (var i = 0; i < originArray.length; i++)
    if (originArray[i].toString() === changedArray[i].toString())
      return false;
  return true;
}
function messTheArray(array) {
  array.sort((a,b) => Math.random()-0.5)
}
//-------------------------------------------------------------------

//Class--------------------------------------------------------------
  //method
ClassSchema.methods.beforeDeleteClass = function() {
  var classId = this._id;
  var groupsId = this.groupsId;
  var teachersId = this.teachersId;
  var groupsDeletedPromise = groupsId.map(
    groupId => Group.deleteWithoutRefreshUpper(groupId)
  )

  var teachersDeletedPromise = teachersId.map(
    teacherId => User.findTeacherById(teacherId)
                     .then(teacherData => teacherData.deleteClass(classId))
                     .then(teacherData => teacherData.save())
  )
  return Promise.all(groupsDeletedPromise.concat(teachersDeletedPromise))
                .then(
                  () => this,
                  (err) => errFilter(err, '删除班级失败')
                )
}
ClassSchema.methods.addGroup = function(groupId) {
  this.groupsId.push(groupId);
  return Promise.resolve(this);
}
ClassSchema.methods.addAssignment = function(assignmentId) {
  this.assignmentsId.push(assignmentId);
  return Promise.resolve(this);
}
ClassSchema.methods.deleteGroup = function(groupIdToDelete) {
  this.groupsId = this.groupsId.filter(v => v.toString() != groupIdToDelete.toString());
  return Promise.resolve(this);
}
ClassSchema.methods.letGroupReview = function() {
  if (this.groupsId.length < 2) {
    return Promise.reject('小组小于2个，无法进行小组间的互改');
  }
  var toReviewGroupsId = letEveryElementInArrayChangeIndex(this.groupsId);
  var groupsDataPromise = this.groupsId.map((groupId, index) => 
    Group.findById(groupId)
         .then(groupData => groupData.updateProperty({toReviewGroupId : toReviewGroupsId[index]}))
         .then(groupData => groupData.save())
  )
  return Promise.all(groupsDataPromise)
                .then(
                  () => this,
                  err => errFilter(err, '发布作业失败，因分配批改小组失败')
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
              .then(teacherData => teacherData.addClass(outsideClass._id))
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
ClassSchema.statics.delete = function(classId) {  // I haven't delete the assignment and the user, never never never tey to use this method
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
GroupSchema.methods.updateProperty = function(updater) {
  for (key in updater) {
    this[key] = updater[key];
  }
  return Promise.resolve(this);
}
GroupSchema.methods.deleteMember = function(memberId) {
  this.studentsId = this.studentsId.filter(v => v.toString() != memberId.toString());
  this.assistantsId = this.assistantsId.filter(v => v.toString() != memberId.toString());
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
  var classId = this.classId;
  var groupId = this._id;
  return Class.findById(classId)
              .then(classData => classData.deleteGroup(groupId))
              .then(classData => classData.save())
              .then(() => this.beforeDeleteGroupWithoutRefreshUpper())
}
GroupSchema.methods.beforeDeleteGroupWithoutRefreshUpper = function() {  // for solve the class delete save version error
  var groupId = this._id;
  var membersId = [];
  membersId = membersId.concat(this.studentsId);
  membersId = membersId.concat(this.assistantsId);
  membersData = membersId.map(
    memberId => User.findById(memberId)
                    .then(memberData => memberData.deleteGroup(groupId))
                    .then(memberData => memberData.save())
  );
  return Promise.all(membersData)
                .then(
                  () => this,
                  (err) => errFilter(err, '删除小组失败')
                )
}
GroupSchema.methods.findStudentWhetherInGroup = function(studentId) {
  var studentsId = this.studentsId;
  for (var i = 0; i < studentsId.length; i++)
    if (studentsId[i].toString() === studentId.toString())
      return Promise.resolve('学生在这个组当中');
  return Promise.reject('学生不在这个组当中');
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
								return Group({name: groupName, classId: classId}).save()
							})
							.then(groupData => {
								outsideGroup = groupData;
                return outsideClass.addGroup(groupData._id);
              })
              .then(classData => classData.save())
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
              // .then(studentData => studentData.updateProperty({groupId: outsideGroup._id}))
              .then(studentData => studentData.addGroup(outsideGroup._id))
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
              // .then(assistantData => assistantData.updateProperty({groupId: outsideGroup._id}))
              .then(assistantData => assistantData.addGroup(outsideGroup._id))
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
              // .then(userData =>  userData.updateProperty({'groupId': null}))
              .then(userData => userData.deleteGroup(groupId))
              .then(userData => userData.save())
              .then(userData => outsideGroup.deleteMember(memberId))
              .then(groupData => groupData.save())
              .then(
                groupData => groupData,
                err => errFilter(err, '删除学生失败')
              )
}
GroupSchema.statics.delete = function(groupId) {
  return Group.auxiDelete(groupId, 'beforeDeleteGroup')
}
GroupSchema.statics.deleteWithoutRefreshUpper = function(groupId) {
  return Group.auxiDelete(groupId, 'beforeDeleteGroupWithoutRefreshUpper')
}
GroupSchema.statics.auxiDelete = function(groupId, beforeDeleteFuncName) {
  return Group.findById(groupId)
              .then(groupData => groupData[beforeDeleteFuncName]())  // So sorry I dont't want to make it commit or rollback
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
UserSchema.methods.addGroup = function(groupId) {
  this.groupsId.push(groupId);
  return Promise.resolve(this);
}
UserSchema.methods.addClass = function(classId) {
  this.classsId.push(classId);
  return Promise.resolve(this);
}
UserSchema.methods.addHomework = function(homeworkId) {
  this.homeworksId.push(homeworkId);
  return Promise.resolve(this);
}
UserSchema.methods.deleteGroup = function(groupIdToDelete) {
  this.groupsId = this.groupsId.filter(groupId => groupId.toString() != groupIdToDelete.toString())
  return Promise.resolve(this);
}
UserSchema.methods.deleteClass = function(classIdToDelete){
  this.classsId = this.classsId.filter(classId => classId.toString() != classIdToDelete.toString())
  return Promise.resolve(this);
}
UserSchema.methods.createAssignmentForClass = function(assignmentData) {
  var classsId = this.classsId;
  if (classsId.length === 0)
    return Promise.reject('创建班级作业失败，该教师没有班级')
  var classsDataPromise = classsId.map(
    classId => Class.findById(classId)
                    .then(classData => classData.addAssignment(assignmentData._id))
                    .then(classData => classData.save())
                    .then(classData => classData.letGroupReview())
  )
  return Promise.all(classsDataPromise)
                .then(() => assignmentData.updateProperty({classsId: classsId}))
                .then(
                  assignmentData => assignmentData,
                  err => errFilter(err, '创建班级作业失败')
                )
}
UserSchema.methods.checkHomework = function(assignmentId) {
  var homeworksId = this.homeworksId;
  var checkResultsPromise = homeworksId.map(homeworkId => 
    Homework.findById(homeworkId)
            .then(homeworkData => homeworkData.assignmentId.toString() === assignmentId.toString()? Promise.resolve(homeworkData._id):Promise.resolve('notFind'))
  )
  return Promise.all(checkResultsPromise).then(
    values => {
      for (var i = 0; i < values.length; i++) {
        if (values[i] !== 'notFind')
          return Promise.resolve({exist: true, homeworkId: values[i]})
      }
      return Promise.resolve({exist: false, values: values})
    }
  )
}
UserSchema.methods.findHomeworkWhetherInStudent = function(homeworkId) {
  var homeworksId = this.homeworksId;
  for (var i = 0; i < homeworksId.length; i++)
    if (homeworksId[i].toString() === homeworkId.toString())
      return Promise.resolve('作业在这个学生中')
  // return Promise.reject(homeworksId)
  return Promise.reject('作业不在这个学生中')
}
UserSchema.methods.findHomeworkByAssignmentID = function(assignmentId) {
  var homeworksId = this.homeworksId;
  var homeworksDataPromise = homeworksId.map(homeworkId => 
    Homework.findById(homeworkId)
  )
  return Promise.all(homeworksDataPromise)
                .then(homeworksData => {
                  for (var i = 0; i < homeworksData.length; i++)
                    if (homeworksData[i].assignmentId.toString() === assignmentId.toString())
                      return Promise.resolve(homeworksData[i])
                  return Promise.reject('用户居然没找到作业，出错了')
                })
}
UserSchema.methods.whetherInGroup = function(groupId) {
  for(var i = 0 ; i < this.groupsId.length; i++)
    if(this.groupsId[i].toString() === groupId.toString())
      return Promise.resolve('该用户在这小组内')
  return Promise.reject('该用户不在这小组内')
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
UserSchema.statics.alreadyLogin = function(account) {
  return  this.findOne({account:account}, {password:0})
              .then(userData => detectUserExist(userData))
              .then(
                userData => userData,
                err => Promise.reject('再次登陆失败')
              )
}
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

//Assignment---------------------------------------------------------
  //methods
AssignmentSchema.methods.updateProperty = function(updater) {
  for (key in updater) {
    this[key] = updater[key];
  }
  return Promise.resolve(this);
}
AssignmentSchema.methods.checkState = function() {
  var now = Date.now();
  if (this.from > now) 
    this.state = 'future';
  else if (this.from <= now && this.end >= now) 
    this.state = 'present';
  else if (this.end < now)
    this.state = 'end';
  return Promise.resolve(this);
}
AssignmentSchema.methods.addHomework = function(homeworkId) {
  this.homeworksId.push(homeworkId);
  return Promise.resolve(this);
}
AssignmentSchema.methods.calculateAllRank = function() {
  var homeworksId = this.homeworksId;
  var homeworksPromise = homeworksId.map(homeworkId => 
    Homework.findById(homeworkId)
  )
  return Promise.all(homeworksPromise)
                .then(homeworksData => {
                  if (!homeworksData.every(homeworkData => homeworkData.finalScore !== null))
                    return Promise.reject('有些作业还没评审')
                  homeworksData.sort((a,b) => parseInt(b.finalScore) - parseInt(a.finalScore))
                  var hasClassRankHomeworksDataPromise = homeworksData.map((homeworkData,index) =>
                    homeworkData.updateProperty({classRank: String(index+1)})
                                .then(homeworkData => homeworkData.save())
                  )
                  return Promise.all(hasClassRankHomeworksDataPromise)
                })
                .then(homeworksData => {
                  var hasGroupRankHomeworksDataPromise = homeworksData.map((homeworkData) =>
                    homeworkData.getGroupRank()
                                .then(homeworkData => homeworkData.save())
                  )
                  return Promise.all(hasGroupRankHomeworksDataPromise)
                })
                .catch(err => errFilter(err, '计算作业排名失败'))
}
  //statics
AssignmentSchema.statics.findById = function(assignmentId) {
  return Assignment.findOne({_id: assignmentId})
                   .then(assignmentData => detectAssignmentExist(assignmentData))
                   .then(assignmentData => assignmentData.checkState())
                   .then(assignmentData => assignmentData.save())
                   .then(
                     assignmentData => assignmentData,
                     err => errFilter(err, '查找班级作业失败')
                   )
}
AssignmentSchema.statics.create = function(teacherId ,name, link, from, end) {
  var assignment = Assignment({name: name, link: link,from: from, end: end});
  return User.findTeacherById(teacherId)
              .then(teacherData => teacherData.createAssignmentForClass(assignment)) // this function will add classsId for assignment and add assignment for class. if no class reject
              .then(assignmentData => assignmentData.save())
              .then(
                assignmentData => assignmentData,
                err => errFilter(err, '创建班级作业失败')
              )
}
AssignmentSchema.statics.getRank = function(assignmentId) {
  return Assignment.findById(assignmentId)
                   .then(assignmentData => assignmentData.calculateAllRank())
                   .then(
                     () => Promise.resolve('计算排名成功'),
                     err => errFilter(err, '计算排名失败')
                   )
} 
AssignmentSchema.statics.delete = function(assignmentId) {

}
//-------------------------------------------------------------------

//Homework-----------------------------------------------------------
  //methods
HomeworkSchema.methods.updateProperty = function(updater) {
  for (key in updater) {
    this[key] = updater[key];
  }
  return Promise.resolve(this);
}
HomeworkSchema.methods.replaceHomework = function(homeworkData) {
  this.github = homeworkData.github;
  this.message = homeworkData.message;
  tools.deleteImage(this.image).catch(err => debug(err));
  tools.deleteSource(this.source).catch(err => debug(err));
  this.image = homeworkData.image;
  this.source = homeworkData.source;
  return Promise.resolve(this);
}
HomeworkSchema.methods.addReview = function(reviewId) {
  this.reviewsId.push(reviewId);
  return Promise.resolve(this);
}
HomeworkSchema.methods.checkAssignmentStateIsPresent = function() {
  return Assignment.findById(this.assignmentId)
                   .then(assignmentData => assignmentData.state === 'present'? Promise.resolve(this):Promise.reject('作业已经截止了'));
}
// HomeworkSchema.methods.checkWhetherHasRank = function() {
//   return (this.classRank !== null && this.groupRank !== null)? Promise.resolve(true): Promise.resolve(false)
// }
HomeworkSchema.methods.getGroupRank = function() {
  var assignmentId = this.assignmentId;
  var homeworkId = this._id;
  return User.findStudentById(this.ownerId)
             .then(studentData => Group.findById(studentData.groupsId[0]))
             .then(groupData => {
               var studentsId = groupData.studentsId;
               var homeworksDataPromise = studentsId.map(studentId => {
                 return User.findStudentById(studentId)
                            .then(studentData => studentData.findHomeworkByAssignmentID(assignmentId))
               })
               return Promise.all(homeworksDataPromise)
                             .then(homeworksData => {
                               homeworksData.sort((a,b) => parseInt(b.finalScore) - parseInt(a.finalScore))
                               for (var i = 0; i < homeworksData.length; i++)
                                 if (homeworksData[i]._id.toString() === homeworkId.toString())
                                   return homeworksData[i].updateProperty({groupRank: String(i+1)})
                               return Promise.reject('居然没找到作业，出错了')
                             })
             })  
}
HomeworkSchema.methods.ownerIs = function(studentId) {
  return this.ownerId.toString() === studentId.toString()? Promise.resolve(this):Promise.reject('拥有者错误')
}
  //statics
HomeworkSchema.statics.findById = function(homeworkId) {
  return Homework.findOne({_id: homeworkId})
                 .then(homeworkData => detectHomeworkExist(homeworkData));
}
HomeworkSchema.statics.create = function(studentId, assignmentId, source, image, github, message) {
  var homework = Homework({ownerId: studentId, assignmentId:assignmentId ,source: source, image: image, github: github, message: message});
  var outsideStudent;
  var outsideAssignment
  return User.findStudentById(studentId)
             .then(studentData => {
                outsideStudent = studentData;
                return Assignment.findById(assignmentId)
             })
             .then(assignmentData => {
               if (assignmentData.state != 'present')
                 return Promise.reject('作业不在提交时间段内');
               outsideAssignment = assignmentData;
               return outsideStudent.checkHomework(assignmentData._id)
             })
             .then(checkResult => {
               if(checkResult.exist === true)
                return Promise.reject('该学生作业已经存在，无法再次提交，应该用更新方法')
               else if (checkResult.exist === false)
                return outsideAssignment.addHomework(homework._id)
             })
             .then(assignmentData => assignmentData.save())
             .then(() => outsideStudent.addHomework(homework._id))
             .then(studentData => studentData.save())
             .then(() => homework.save())
             .then(
               homeworkData => homeworkData,
               err => {
                tools.deleteSource(source).catch(err => debug(err))  //commit or rollback
                tools.deleteImage(image).catch(err => debug(err))
                return errFilter(err, '添加作业失败')
               }
             )
}
HomeworkSchema.statics.update = function(studentId, homeworkId, source, image, github, message) {
  var homework = Homework({ownerId: studentId,source: source, image: image, github: github, message: message});
  return User.findStudentById(studentId)
             .then(studentData => {
                return Homework.findById(homeworkId)
             })
             .then(homeworkData => homeworkData.checkAssignmentStateIsPresent())
             .then(homeworkData => homeworkData.replaceHomework(homework))
             .then(homeworkData => homeworkData.save())
             .then(
               homeworkData => homeworkData,
               err => {
                tools.deleteSource(source).catch(err => debug(err))  //commit or rollback
                tools.deleteImage(image).catch(err => debug(err))
                return errFilter(err, '更新作业失败')
               }
             )
}

HomeworkSchema.statics.assistantFinalReview = function(assistantId, groupId, studentId, homeworkId, message, score) {
  return User.findAssistantById(assistantId)
             .then(assistantData => assistantData.whetherInGroup(groupId))
             .then(() => User.findStudentById(studentId))
             .then(studentData => studentData.whetherInGroup(groupId))
             .then(() => Homework.findById(homeworkId))
             .then(homeworkData => homeworkData.ownerIs(studentId))
             .then(homeworkData => homeworkData.updateProperty({finalScore:score,finalMessage:message}))
             .then(homeworkData => homeworkData.save())
             .then(
               homeworkData => homeworkData,
               err => errFilter(err, '助教最终评审失败')
             )
}
HomeworkSchema.statics.teacherFinalReview = function(homeworkId, message, score) {
  return Homework.findById(homeworkId)
                 .then(homeworkData => homeworkData.updateProperty({finalScore:score,finalMessage:message}))
                 .then(homeworkData => homeworkData.save())
                 .then(
                   homeworkData => homeworkData,
                   err => errFilter(err, '老师最终评审失败')
                 )
}
//-------------------------------------------------------------------

//Review-------------------------------------------------------------
ReviewSchema.statics.findById = function(reviewId) {
    return Review.findOne({_id: reviewId})
                 .then(reviewData => detectReviewExist(reviewData));
}
ReviewSchema.statics.create = function(reviewerId, groupId, studentId, homeworkId, message, score) {
  var outsideHomework;
  var review = Review({ownerId: reviewerId, beReviewerId: studentId, message: message, score: score, homeworkId: homeworkId})
  return Group.findById(groupId)
              .then(groupData => groupData.findStudentWhetherInGroup(studentId))
              .then(() => User.findStudentById(studentId))
              .then(studentData => studentData.findHomeworkWhetherInStudent(homeworkId))
              .then(() => Homework.findById(homeworkId))
              .then(homeworkData => homeworkData.checkAssignmentStateIsPresent())
              .then(homeworkData => {
                outsideHomework = homeworkData;
                return review.save();
              })
              .then(reviewData => outsideHomework.addReview(reviewData._id))
              .then(homeworkData => homeworkData.save())
              .then(
                () => review,
                err => errFilter(err, '添加审评失败')
              )
}
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