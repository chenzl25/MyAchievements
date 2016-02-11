'use strict';
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('./testServer');

var tools = require('../lib/tools');

var User = require('../database/data').User;
var Class = require('../database/data').Class;
var Group = require('../database/data').Group;
var Assignment = require('../database/data').Assignment;
var Homework = require('../database/data').Homework;
var Review = require('../database/data').Review;

var mongoose = require('mongoose');

var agentManager;  // use this to the thing needed auth
var agentTeacher;
var agentStudent;
var agentAssistant;
var classId; 
var groupOneId;
var groupTwoId;
var groupsId = [];
var testReviewStudentsId = [];
var toReviewGroupsId = [];
var indexOfReviewGroupInOriginGroup = [];
var indexOfOriginGroupInReviewGroup = [];
var teacherOneId;
var teacherTwoId
var studentOneId;
var studentTwoId;
var assistantOneId;
var assistantTwoId;
var assignmentId;
var homeworkId;
var homeworksId = [];
var agentStudents = [];
var reviewId;
var wrongId = '56a6d439558937d21b647828';

chai.use(chaiHttp);
describe('Total test', function() {
  before(function(done){
    User.collection.drop();
    Class.collection.drop();
    Group.collection.drop();
    Assignment.collection.drop();
    Homework.collection.drop();
    Review.collection.drop();
    User.register('manager', 'manager', 'Manager', '595084778@qq.com', 'manager')
				.then(userData => done(),
							errorMessage => done())
    
  });
  after(function(done){
    User.collection.drop();
    Class.collection.drop();
    Group.collection.drop();
    Assignment.collection.drop();
    Homework.collection.drop();
    Review.collection.drop();
    done();
  });
	// it('should register login successfully', function(done) {
	// 	chai.request(server)
	// 			.post('/Mapi/Mregister')
	// 			.send({account:'444444', password:'444444', name:'haha', email:"chenzl25@mail2.sysu.edu.cn"})
	// 			.then((res) => {
	// 				expect(res.body.error).equal(false);	
	// 				agentManager = chai.request.agent(server);
	// 				agentManager
	// 					.post('/api/login')
	// 					.send({'account':'444444', 'password':'444444'})
	// 					.then((res) =>{
	// 				    expect(res.body.error).equal(false);
	// 				    done();
	// 					});
	// 			}).catch(function(err) {
	// 				done(err);
	// 			});
	// });
	it('should register login successfully', function(done) {
		agentManager = chai.request.agent(server);
		agentManager
			.post('/api/login')
			.send({'account':'manager', 'password':'manager'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	});
	it('register successfully', function(done) {
		agentManager
				.post('/Mapi/register')
				.send({'account':'teacher1', 'password':'teacher1', 'name':'KKKKK', 'email':"kkkkk@qq.com", 'position':"teacher"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
					teacherOneId = res.body.userData._id;
					done();
				});
	});
	it('register successfully', function(done) {
		agentManager
				.post('/Mapi/register')
				.send({'account':'teacher2', 'password':'teacher2', 'name':'KKKKK', 'email':"kkkkk@qq.com", 'position':"teacher"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
					teacherTwoId = res.body.userData._id;
					done();
				});
	});
	it('register successfully', function(done) {
		agentManager
				.post('/Mapi/register')
				.send({'account':'0000000', 'password':'0000000', 'name':'dylan', 'email':"595084778@qq.com", 'position':"student"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
					studentOneId = res.body.userData._id;
					done();
				});
	});
	it('register successfully', function(done) {
		agentManager
				.post('/Mapi/register')
				.send({'account':'1111111', 'password':'1111111', 'name':'dylan', 'email':"595084778@qq.com", 'position':"student"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
					studentTwoId = res.body.userData._id;
					done();
				});
	});
	it('register assistant successfully', function(done) {
		agentManager
				.post('/Mapi/register')
				.send({'account':'assistant1', 'password':'assistant1', 'name':'tata', 'email':"tatata@qq.com", 'position':"assistant"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
					assistantOneId = res.body.userData._id;
					done();
				});
	});
	it('register assistant successfully', function(done) {
		agentManager
				.post('/Mapi/register')
				.send({'account':'assistant2', 'password':'assistant2', 'name':'tata', 'email':"tatata@qq.com", 'position':"assistant"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
					assistantTwoId = res.body.userData._id;
					done();
				});
	});
	it('create class ', function(done) {
		agentManager
			.post('/Mapi/class')
			.send({name:'class123'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				classId = res.body.classData._id;
				done();
			});
	});
	it('create group ', function(done) {
		agentManager
			.post('/Mapi/class/'+classId+'/group')
			.send({name:'groupeee'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData).to.be.a('object');
				expect(res.body.groupData).to.has.property('_id');
				groupOneId = res.body.groupData._id;
				groupsId.push(res.body.groupData._id)
				done();
			});
	});

	it('create group ', function(done) {
		agentManager
			.post('/Mapi/class/'+classId+'/group')
			.send({name:'groupfff'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData).to.be.a('object');
				expect(res.body.groupData).to.has.property('_id');
				groupTwoId = res.body.groupData._id;
				groupsId.push(res.body.groupData._id)
				done();
			});
	});
	it('add teacher for class successfully', function(done) {
		agentManager
			.post('/Mapi/class/'+classId+'/teacher/'+teacherOneId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.classData).to.be.a('object');
				expect(res.body.classData).to.has.property('_id');
				expect(res.body.classData._id).equal(classId);
				expect(res.body.classData.teachersId).to.be.a('array');
				expect(res.body.classData.teachersId.indexOf(teacherOneId)).not.equal(-1);
				done();
			});
	});
	it('add teacher for class fail', function(done) {
		agentManager
			.post('/Mapi/class/'+classId+'/teacher/'+teacherTwoId)
			.end(function(err, res) {
				expect(res.body.error).equal(true);
				expect(res.body.message).equal('一个班级最多只能一个教师');
				done();
			});
	});
	it('add student for group successfully', function(done) {
		agentManager
			.post('/Mapi/group/'+groupOneId+'/student/'+studentOneId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.studentsId).to.has.length(1);
				testReviewStudentsId.push(studentOneId)
				done();
			});
	});
	it('add student for group successfully', function(done) {
		agentManager
			.post('/Mapi/group/'+groupTwoId+'/student/'+studentTwoId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.studentsId).to.has.length(1);
				testReviewStudentsId.push(studentTwoId)
				done();
			});
	});
	it('add assistant for group successfully', function(done) {
		agentManager
			.post('/Mapi/group/'+groupOneId+'/assistant/'+assistantOneId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.assistantsId).to.has.length(1);
				done();
			});
	});
	it('add assistant for group successfully', function(done) {
		agentManager
			.post('/Mapi/group/'+groupTwoId+'/assistant/'+assistantTwoId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.assistantsId).to.has.length(1);
				done();
			});
	});
	it('should register login successfully', function(done) {
		agentTeacher = chai.request.agent(server);
		agentTeacher
			.post('/api/login')
			.send({'account':'teacher1', 'password':'teacher1'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	});
	it('create group ', function(done) {
		agentManager
			.post('/Mapi/class/'+classId+'/group')
			.send({name:'groupddd'})
			.then((res) => {
				expect(res.body.error).equal(false);
				expect(res.body.groupData).to.be.a('object');
				expect(res.body.groupData).to.has.property('_id');
				groupsId.push(res.body.groupData._id)
				done();
			});
	});
	it('create group ', function(done) {
		agentManager
			.post('/Mapi/class/'+classId+'/group')
			.send({name:'groupaaa'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData).to.be.a('object');
				expect(res.body.groupData).to.has.property('_id');
				groupsId.push(res.body.groupData._id)
				done();
			})
	});
	it('create group ', function(done) {
		agentManager
			.post('/Mapi/class/'+classId+'/group')
			.send({name:'groupbbb'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData).to.be.a('object');
				expect(res.body.groupData).to.has.property('_id');
				groupsId.push(res.body.groupData._id)
				done();
			});
	});
	it('create group ', function(done) {
		agentManager
			.post('/Mapi/class/'+classId+'/group')
			.send({name:'groupccc'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData).to.be.a('object');
				expect(res.body.groupData).to.has.property('_id');
				groupsId.push(res.body.groupData._id)
				done();
			});
	});
	
	it('register student successfully', function(done) {
		agentManager
			.post('/Mapi/register')
			.send({'account':'2222222', 'password':'2222222', 'name':'aaa', 'email':"kkkkk@qq.com", 'position':"student"})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData).to.be.a('object');
				testReviewStudentsId.push(res.body.userData._id);
				done();
			});
	});
	it('add student to group', function(done) {
		agentManager
			.post('/Mapi/group/'+groupsId[2] + '/student/'+testReviewStudentsId[2])
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				done();
			})
	})
	it('register student successfully', function(done) {
		agentManager
			.post('/Mapi/register')
			.send({'account':'3333333', 'password':'3333333', 'name':'bbb', 'email':"kkkkk@qq.com", 'position':"student"})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData).to.be.a('object');
				testReviewStudentsId.push(res.body.userData._id);
				done();
			});
	});
	it('add student to group', function(done) {
		agentManager
			.post('/Mapi/group/'+groupsId[3] + '/student/'+testReviewStudentsId[3])
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				done();
			})
	})
	it('register student successfully', function(done) {
		agentManager
			.post('/Mapi/register')
			.send({'account':'4444444', 'password':'4444444', 'name':'ccc', 'email':"kkkkk@qq.com", 'position':"student"})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData).to.be.a('object');
				testReviewStudentsId.push(res.body.userData._id);
				done();
			});
	});
	it('add student to group', function(done) {
		agentManager
			.post('/Mapi/group/'+groupsId[4] + '/student/'+testReviewStudentsId[4])
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				done();
			})
	})
	it('register student successfully', function(done) {
		agentManager
			.post('/Mapi/register')
			.send({'account':'5555555', 'password':'5555555', 'name':'ddd', 'email':"kkkkk@qq.com", 'position':"student"})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData).to.be.a('object');
				testReviewStudentsId.push(res.body.userData._id);
				done();
			});
	});
	it('add student to group', function(done) {
		agentManager
			.post('/Mapi/group/'+groupsId[5] + '/student/'+testReviewStudentsId[5])
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				done();
			})
	})
	
	it('teacher add assignment', function(done) {
		agentTeacher
			.post('/Tapi/assignment')
			.send({name: 'myAchievement', link:'www.google.com', from:String(1453861720310+2500000), end:String(1453861720310+3000000000)})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				assignmentId = res.body.assignmentData._id;
				done();
			});
	});
	it('teacher update assignment', function(done) {
		agentTeacher
			.put('/Tapi/assignment/' + assignmentId)
			.send({name: 'another_myAchievement', link:'www.another_google.com', from:String(1453861720310+2500000), end:String(1453861720310+3000000000+1)})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.assignmentData.name).equal('another_myAchievement');
				expect(res.body.assignmentData.link).equal('www.another_google.com');
				done();
			});
	});
	it('teacher add assignment', function(done) {
		agentTeacher
			.post('/Tapi/assignment')
			.send({name: 'myAchievement', link:'www.baidu.com', from:String(1453861720310+2500000), end:String(1453861720310+1)})
			.end(function(err, res) {
				expect(res.body.error).equal(true);
				expect(res.body.message).equal('班级作业的结束时间要大于开始时间')
				// assignmentId = res.body.assignmentData._id;
				done();
			});
	});
	it('teacher search group ensure the toReviewGroup normally', function(done) {
		agentTeacher
			.get('/Tapi/group/'+groupsId[0])
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.toReviewGroupId).not.equal(groupsId[0])
				toReviewGroupsId.push(res.body.groupData.toReviewGroupId)
				done();
			});
	});
	it('teacher search group ensure the toReviewGroup normally', function(done) {
		agentTeacher
			.get('/Tapi/group/'+groupsId[1])
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.toReviewGroupId).not.equal(groupsId[1])
				toReviewGroupsId.push(res.body.groupData.toReviewGroupId)
				done();
			});
	});
	it('teacher search group ensure the toReviewGroup normally', function(done) {
		agentTeacher
			.get('/Tapi/group/'+groupsId[2])
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.toReviewGroupId).not.equal(groupsId[2])
				toReviewGroupsId.push(res.body.groupData.toReviewGroupId)
				done();
			});
	});
	it('teacher search group ensure the toReviewGroup normally', function(done) {
		agentTeacher
			.get('/Tapi/group/'+groupsId[3])
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.toReviewGroupId).not.equal(groupsId[3])
				toReviewGroupsId.push(res.body.groupData.toReviewGroupId)
				done();
			});
	});
	it('teacher search group ensure the toReviewGroup normally', function(done) {
		agentTeacher
			.get('/Tapi/group/'+groupsId[4])
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.toReviewGroupId).not.equal(groupsId[4])
				toReviewGroupsId.push(res.body.groupData.toReviewGroupId)
				done();
			});
	});
	it('teacher search group ensure the toReviewGroup normally', function(done) {
		agentTeacher
			.get('/Tapi/group/'+groupsId[5])
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.toReviewGroupId).not.equal(groupsId[5])
				toReviewGroupsId.push(res.body.groupData.toReviewGroupId)
				done();
			});
	});
	it('search class to look at the assignment whether add successfully', function(done) {
		agentTeacher
			.get('/Tapi/class/'+classId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.classData.assignmentsId.indexOf(assignmentId)).not.equal(-1);
				done();
			});
	});
	it('search assignment to look at the state whether change successfully', function(done) {
		agentTeacher
			.get('/Tapi/assignment/'+assignmentId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				done();
			});
	});
	it('Student login successfully', function(done) {
		agentStudent = chai.request.agent(server);
		agentStudent
			.post('/api/login')
			.send({'account':'0000000', 'password':'0000000'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	});
	it('Student upload homework', function(done) {
		agentStudent
			.post('/Sapi/assignment/'+assignmentId+'/homework')
			.send({github:'http://github.com/chenzl25'})
			.attach('source', __dirname+'/files/14331048.bz2')
			.attach('image', __dirname+'/files/abc.png')
			.end(function(req, res) {
				expect(res.body.error).equal(false);
				homeworkId = res.body.homeworkData._id;
				homeworksId.push(res.body.homeworkData._id);
				tools.deleteImage(res.body.homeworkData.image);  //clean
				tools.deleteSource(res.body.homeworkData.source);//clean
				done();
			})
	})
	it('Student update homework', function(done) {
		agentStudent
			.put('/Sapi/homework/'+homeworkId)
			.send({github:'http://github.com/chenzl25/yacc', message:'lex'})
			.attach('source', __dirname+'/files/14331048.tar')
			.attach('image', __dirname+'/files/abc.png')
			.end(function(req, res) {
				expect(res.body.error).equal(false);
				expect(res.body.homeworkData._id).equal(homeworkId)
				tools.deleteImage(res.body.homeworkData.image);  //clean
				tools.deleteSource(res.body.homeworkData.source);//clean
				done();
			})
	})
	it('Student login to ensure the homework has been upload', function(done) {
		agentStudent
			.post('/api/login')
			.send({'account':'0000000', 'password':'0000000'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    expect(res.body.userData.homeworksId.indexOf(homeworkId)).not.equal(-1);
		    done();
			});
	});
	it('find the assignment to ensure the homeworkId', function(done) {
		agentStudent
			.get('/Sapi/assignment/'+assignmentId)
			.end(function(req, res) {
				expect(res.body.error).equal(false);
				expect(res.body.assignmentData.homeworksId.indexOf(homeworkId)).not.equal(-1);
				done();
			})
	})
	it('Student upload homework', function(done) {
		agentStudent
			.post('/Sapi/assignment/'+assignmentId+'/homework')
			.send({github:'http://github.com/chenzl25'})
			.attach('source', __dirname+'/files/14331048.bz2')
			// .attach('image', 'files/abc.png')
			.end(function(req, res) {
				expect(res.body.error).equal(true);
				expect(res.body.message).equal('预览图没有上传')
				done();
			})
	})
	it('Student upload homework', function(done) {
		agentStudent
			.post('/Sapi/assignment/'+assignmentId+'/homework')
			.send({github:'http://github.com/chenzl25'})
			// .attach('source', __dirname+'/files/14331048.bz2')
			.attach('image', __dirname+'/files/abc.png')
			.end(function(req, res) {
				expect(res.body.error).equal(true);
				expect(res.body.message).equal('源文件没有上传')
				done();
			})
	})
	it('prepare the data to test review', function(done) {
		for (var i = 0; i < groupsId.length; i++) {
			indexOfReviewGroupInOriginGroup.push(groupsId.indexOf(toReviewGroupsId[i]))
			indexOfOriginGroupInReviewGroup.push(toReviewGroupsId.indexOf(groupsId[i]))
		}
		done();
	})
	for (let i = 0; i < groupsId.length; i++){
		it('test indexOfReviewGroupInOriginGroup', function(done) {
			agentManager
				.get('/Mapi/group/'+groupsId[i])
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.groupData.toReviewGroupId).equal(toReviewGroupsId[i])
					done();
				})
		})
	}
	var agentToReview;
	it('login the student who review the studentOne', function(done) {
		var accountChar = indexOfOriginGroupInReviewGroup[0].toString();
		var account = '';
		var password = '';
		for (var i = 0; i < 7; i++)
			account += accountChar;
		password = account;
		agentToReview = chai.request.agent(server);
		agentToReview
			.post('/api/login')
			.send({'account':account, 'password':password})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('add review, note every only have one student now', function(done) {
		agentToReview 
			.post('/Sapi/group/'+groupsId[0]+'/student/'+testReviewStudentsId[0]+'/homework/'+homeworkId+'/review')
			.send({message:"well done well done well done well done well done well done well done well done well done ", score:"99"})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				reviewId = res.body.reviewData._id;
				done();
			})
	})
	
	it('assistant login successfully', function(done) {
		agentAssistant = chai.request.agent(server);
		agentAssistant
			.post('/api/login')
			.send({'account':'assistant1', 'password':'assistant1'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
		    done();
			})
			// .then((res) =>{
		 //    expect(res.body.error).equal(false);
		 //    done();
	})
	it('assistant finalReview successfully', function(done) {
		agentAssistant
			.post('/Aapi/group/'+groupsId[0]+'/student/'+testReviewStudentsId[0]+'/homework/'+homeworkId+'/finalReview')
			.send({message:'messagemessagemessagemessagemessagemessagemessagemessagemessage', score:'85'})
			.end(function(err, res) {
				expect(res.body.error).equal(false)
				done();
			})
	})
	it('teacher finalReview successfully', function(done) {
		agentTeacher
			.post('/Tapi/homework/'+homeworkId+'/finalReview')
			.send({message:'teacherteacherteacherteacherteacherteacherteacherteacher', score:'10'})
			.end(function(err, res) {
				expect(res.body.error).equal(false)
				done();
			})
	})
	it('student login', function(done) {
		agentStudents.push(chai.request.agent(server))
		agentStudents[0]
			.post('/api/login')
			.send({'account':'0000000', 'password':'0000000'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('student login', function(done) {
		agentStudents.push(chai.request.agent(server))
		agentStudents[1]
			.post('/api/login')
			.send({'account':'1111111', 'password':'1111111'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('student login', function(done) {
		agentStudents.push(chai.request.agent(server))
		agentStudents[2]
			.post('/api/login')
			.send({'account':'2222222', 'password':'2222222'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('student login', function(done) {
		agentStudents.push(chai.request.agent(server))
		agentStudents[3]
			.post('/api/login')
			.send({'account':'3333333', 'password':'3333333'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('student login', function(done) {
		agentStudents.push(chai.request.agent(server))
		agentStudents[4]
			.post('/api/login')
			.send({'account':'4444444', 'password':'4444444'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('student login', function(done) {
		agentStudents.push(chai.request.agent(server))
		agentStudents[5]
			.post('/api/login')
			.send({'account':'5555555', 'password':'5555555'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	for (let i = 1; i < 6; i++)
		it('student upload homework', function(done) {
			agentStudents[i]
				.post('/Sapi/assignment/'+assignmentId+'/homework')
				.send({github:'http://github.com/chenzl25'})
				.attach('source', __dirname+'/files/14331048.tar')
				.attach('image', __dirname+'/files/abc.png')
				.end(function(req, res) {
					expect(res.body.error).equal(false);
					homeworksId.push(res.body.homeworkData._id)
					tools.deleteImage(res.body.homeworkData.image);  //clean
					tools.deleteSource(res.body.homeworkData.source);//clean
					done();
				})
		})
	for (let i = 0; i < 5; i++)  // deliberately fot get one to test
		it('teacher finalReview successfully', function(done) {
			agentTeacher
				.post('/Tapi/homework/'+homeworksId[i]+'/finalReview')
				.send({message:'teacherteacherteacherteacherteacherteacherteacherteacher', score:String(Math.floor(Math.random()*100))})
				.end(function(err, res) {
					let homeworkData = res.body.homeworkData
					expect(res.body.error).equal(false)
					done();
				})
		})
	it('calculate the rank fail', function(done) {
		agentTeacher
			.put('/Tapi/assignment/'+assignmentId+'/rank')
			.end(function(err, res) {
				expect(res.body.error).equal(true)
				expect(res.body.message).equal('有些作业还没评审')
				done();
			})
	})
	it('teacher finalReview successfully', function(done) {
			agentTeacher
				.post('/Tapi/homework/'+homeworksId[5]+'/finalReview')
				.send({message:'teacherteacherteacherteacherteacherteacherteacherteacher', score:String(Math.floor(Math.random()*100))})
				.end(function(err, res) {
					let homeworkData = res.body.homeworkData
					expect(res.body.error).equal(false)
					done();
				})
		})
	it('calculate the rank successfully', function(done) {
		agentTeacher
			.put('/Tapi/assignment/'+assignmentId+'/rank')
			.end(function(err, res) {
				expect(res.body.error).equal(false)
				done();
			})
	})
	for (let i = 0; i < 6; i++)
		it('teacher finalReview successfully', function(done) {
			agentTeacher
				.get('/Tapi/homework/'+homeworksId[i])
				.end(function(err, res) {
					let homeworkData = res.body.homeworkData
					expect(res.body.error).equal(false)
					done();
				})
		})
	// the GroupRankTest is below
	var testGroupRankStudentsId = [];
	var testGroupRankHomeworksId = [];
	var testGroupRankAgents = [];
	var testGroupNumber = 10;
	var testGroupRankResult = [];
	for(let i = 0; i < testGroupNumber; i++){
		it('register student successfully', function(done) {
			agentManager
				.post('/Mapi/register')
				.send({'account':'student'+i, 'password':'student'+i, 'name':'aaa', 'email':"kkkkk@qq.com", 'position':"student"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
					testGroupRankStudentsId.push(res.body.userData._id);
					done();
				});
		});
		it('add student to group', function(done) {
			agentManager
				.post('/Mapi/group/'+groupsId[0] + '/student/'+testGroupRankStudentsId[i])
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					done();
				})
		})
		it('student login', function(done) {
			testGroupRankAgents.push(chai.request.agent(server))
			testGroupRankAgents[i]
				.post('/api/login')
				.send({'account':'student'+i, 'password':'student'+i})
				.then((res) =>{
			    expect(res.body.error).equal(false);
			    done();
				});
		})
		it('student upload homework', function(done) {
			testGroupRankAgents[i]
				.post('/Sapi/assignment/'+assignmentId+'/homework')
				.send({github:'http://github.com/chenzl25'})
				.attach('source', __dirname+'/files/14331048.tar')
				.attach('image', __dirname+'/files/abc.png')
				.end(function(req, res) {
					expect(res.body.error).equal(false);
					testGroupRankHomeworksId.push(res.body.homeworkData._id)
					tools.deleteImage(res.body.homeworkData.image);  //clean
					tools.deleteSource(res.body.homeworkData.source);//clean
					done();
				})
		})
		it('teacher finalReview successfully', function(done) {
			agentTeacher
				.post('/Tapi/homework/'+testGroupRankHomeworksId[i]+'/finalReview')
				.send({message:'teacherteacherteacherteacherteacherteacherteacherteacher', score:String(Math.floor(Math.random()*100))})
				.end(function(err, res) {
					let homeworkData = res.body.homeworkData
					expect(res.body.error).equal(false)
					done();
				})
		})
	}
	it('calculate the rank successfully', function(done) {
		agentTeacher
			.put('/Tapi/assignment/'+assignmentId+'/rank')
			.end(function(err, res) {
				expect(res.body.error).equal(false)
				done();
			})
	})
	for (let i = 0; i < testGroupNumber; i++)
		it('teacher finalReview successfully', function(done) {
			agentTeacher
				.get('/Tapi/homework/'+testGroupRankHomeworksId[i])
				.end(function(err, res) {
					let homeworkData = res.body.homeworkData
					testGroupRankResult.push([homeworkData.finalScore, homeworkData.classRank, homeworkData.groupRank])
					expect(res.body.error).equal(false)
					done();
				})
		})
	it('show the groupRank result', function(done) {
		done();
	})
	for (let i = 0; i < 6; i++)
		it('student get group', function(done) {
			agentStudents[i]
				.get('/Sapi/group')
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.groupData._id).equal(groupsId[i])
					done();
				})
		})
	for (let i = 0; i < 6; i++)
		it('student get homeworks', function(done) {
			agentStudents[i]
				.get('/Sapi/homeworks')
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.homeworksData[0]._id).equal(homeworksId[i])
					done();
				})
		})
	it('update review', function(done) {
		agentToReview
			.put('/Sapi/review/'+reviewId)
			.send({message:'hehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehe', score:'9'})
			.end(function(err, res) {
				expect(res.body.error).equal(false)
				done();
			})
	})
	for (let i = 0; i < 6; i++)
		it('student get homeworks', function(done) {
			agentStudents[i]
				.get('/Sapi/homework/'+homeworksId[i]+'/reviews')
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					done();
				})
		})
	it('student get homeworks', function(done) {
			agentStudents[0]
				.get('/Sapi/homeworks')
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.homeworksData[0]._id).equal(homeworksId[0])
					done();
				})
		})
	it('student login', function(done) {
		agentStudents.push(chai.request.agent(server))
		agentStudents[0]
			.post('/api/login')
			.send({'account':'0000000', 'password':'0000000'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('get toReviewHomeworks', function(done) {
		agentToReview 
			.get('/Sapi/assignment/'+assignmentId+'/toReviewHomeworks')
			.end(function(err, res) {
				reviewId = res.body.homeworksData[0].LINK_review._id
				expect(res.body.error).equal(false);
				done();
			})
	})
	it('update review', function(done) {
		agentToReview 
			.put('/Sapi/review/'+reviewId)
			.send({message:'newnewnenwnewnenwnewnenwnenwnewnenwnenwnewnnewnenwnewn', score:'15'})
			.end(function(err, res) {
				// reviewId = res.body.homeworksData[0].LINK_review.reviewer
				expect(res.body.error).equal(false);
				done();
			})
	})
	it('change password', function(done) {
		agentStudents[5]
			.post('/api/changePassword')
			.send({oldPassword:'5555555', newPassword:'newPassword'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				done();
			})
	})
	it('login successfully after change password', function(done) {
		chai.request(server)
				.post('/api/login')
				.send({account: '5555555', password:'newPassword'})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					done()
				})
	})
	it('change password', function(done) {
		agentStudents[5]
			.post('/api/changePassword')
			.send({oldPassword:'newPassword', newPassword:'5555555'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				done();
			})
	})
	it('assistant login successfully', function(done) {
		agentAssistant = chai.request.agent(server);
		agentAssistant
			.post('/api/login')
			.send({'account':'assistant1', 'password':'assistant1'})
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('assistant get toReviewHomeworks', function(done) {
		agentAssistant
			.get('/Aapi/assignment/'+assignmentId+'/toReviewHomeworks')
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('teacher login fail', function(done) {
		chai.request(server)
			.post('/api/login')
			.then((res) =>{
		    expect(res.body.error).equal(true);
		    done();
			});
	})
	it('teacher alreadylogin successfully', function(done) {
		agentTeacher
			.post('/api/login')
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('teacher get toReviewHomeworks', function(done) {
		agentTeacher
			.get('/Tapi/assignment/'+assignmentId+'/toReviewHomeworks')
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('manager get classs', function(done) {
		agentManager
			.get('/Mapi/classs')
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('manager get groups', function(done) {
		agentManager
			.get('/Mapi/groups')
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
	it('manager get users', function(done) {
		agentManager
			.get('/Mapi/users')
			.then((res) =>{
		    expect(res.body.error).equal(false);
		    done();
			});
	})
});

