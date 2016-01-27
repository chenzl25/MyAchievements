var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('./testServer');

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
var classId; 
var groupOneId;
var groupTwoId;
var teacherOneId;
var teacherTwoId
var studentOneId;
var studentTwoId;
var assistantOneId;
var assistantTwoId;
var assignmentId;
var wrongId = '56a6d439558937d21b647828';

chai.use(chaiHttp);
describe('Manager: Register, Login and Post:', function() {
  before(function(done){
    User.collection.drop();
    Class.collection.drop();
    Group.collection.drop();
    Assignment.collection.drop();
    Homework.collection.drop();
    Review.collection.drop();
    done();
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
	it('should register login successfully', function(done) {
		chai.request(server)
				.post('/Mapi/Mregister')
				.send({account:'444444', password:'444444', name:'haha', email:"chenzl25@mail2.sysu.edu.cn"})
				.then((res) => {
					expect(res.body.error).equal(false);	
					agentManager = chai.request.agent(server);
					agentManager
						.post('/api/login')
						.send({'account':'444444', 'password':'444444'})
						.then((res) =>{
					    expect(res.error).equal(false);
					    done();
						});
				}).catch(function(err) {
					done(err);
				});
	});
	it('register successfully', function(done) {
		agentManager
				.post('/Mapi/register')
				.send({'account':'222222', 'password':'222222', 'name':'KKKKK', 'email':"kkkkk@qq.com", 'position':"teacher"})
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
				.send({'account':'aaaaaa', 'password':'222222a', 'name':'KKKKK', 'email':"kkkkk@qq.com", 'position':"teacher"})
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
				.send({'account':'888888', 'password':'888888', 'name':'dylan', 'email':"595084778@qq.com", 'position':"student"})
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
				.send({'account':'bbbbbb', 'password':'888888', 'name':'dylan', 'email':"595084778@qq.com", 'position':"student"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
					studentTwoId = res.body.userData._id;
					done();
				});
	});
	it('register successfully', function(done) {
		agentManager
				.post('/Mapi/register')
				.send({'account':'999999', 'password':'999999', 'name':'tata', 'email':"tatata@qq.com", 'position':"assistant"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
					assistantOneId = res.body.userData._id;
					done();
				});
	});
	it('register successfully', function(done) {
		agentManager
				.post('/Mapi/register')
				.send({'account':'cccccc', 'password':'999999', 'name':'tata', 'email':"tatata@qq.com", 'position':"assistant"})
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
			.send({name:'group456'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData).to.be.a('object');
				expect(res.body.groupData).to.has.property('_id');
				groupOneId = res.body.groupData._id;
				done();
			});
	});

	it('create group ', function(done) {
		agentManager
			.post('/Mapi/class/'+classId+'/group')
			.send({name:'group789'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData).to.be.a('object');
				expect(res.body.groupData).to.has.property('_id');
				groupTwoId = res.body.groupData._id;
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
	it('add teacher for class successfully', function(done) {
		agentManager
			.post('/Mapi/class/'+classId+'/teacher/'+teacherTwoId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.classData).to.be.a('object');
				expect(res.body.classData).to.has.property('_id');
				expect(res.body.classData._id).equal(classId);
				expect(res.body.classData.teachersId).to.be.a('array');
				expect(res.body.classData.teachersId.indexOf(teacherTwoId)).not.equal(-1);
				done();
			});
	});
	it('add student for group successfully', function(done) {
		agentManager
			.post('/Mapi/group/'+groupOneId+'/student/'+studentOneId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.studentsId).to.has.length(1);
				done();
			});
	});
	it('add student for group successfully', function(done) {
		agentManager
			.post('/Mapi/group/'+groupTwoId+'/student/'+studentTwoId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.studentsId).to.has.length(1);
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
			.send({'account':'222222', 'password':'222222'})
			.then((res) =>{
		    expect(res.error).equal(false);
		    done();
			});
	});
	it('teacher add assignment', function(done) {
		agentTeacher
			.post('/Tapi/assignment')
			.send({name: 'myAchievement', link:'www.google.com', from:String(1453861720310+2500000), end:String(1453861720310+3000000)})
			.end(function(err, res) {
				console.log(res.body);
				expect(res.body.error).equal(false);
				assignmentId = res.body.assignmentData._id;
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
			.send({'account':'888888', 'password':'888888'})
			.then((res) =>{
		    expect(res.error).equal(false);
		    done();
			});
	});
	it('Student upload homework', function(done) {
		agentStudent
			.post('/Sapi/assignment/'+assignmentId+'/homework')
			.send({github:'http://github.com/chenzl25'})
			.attach('source', 'files/14331048.bz2')
			.attach('image', 'files/abc.png')
			.end(function(req, res) {
				console.log(res.body)
				expect(res.error).equal(false);
				homeworkId = res.body.homeworkData._id;
				done();
			})
	})
	it('find the assignment to ensure the homeworkId', function(done) {
		agentStudent
			.get('/Sapi/assignment/'+assignmentId)
			.end(function(req, res) {
				expect(res.error).equal(false);
				expect(res.body.assignmentData.homeworksId.indexOf(homeworkId)).not.equal(-1);
			})
	})
});
// describe('upload', function() {
//     it('a file', function(done) {
//        request.post('/your/endpoint')
              // .field('extra_info', '{"in":"case you want to send json along with your file"}')
//               .attach('image', 'path/to/file.jpg')
//               .end(function(err, res) {
//                   res.should.have.status(200); // 'success' status
//                   done();
//               });
//     });
// });
