var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var server = require('./testServer');

var User = require('../database/data.js').User;
var mongoose = require('mongoose');

var agent;  // use this to the thing needed auth
var classId; 
var groupOneId;
var groupTwoId;
var teacherOneId;
var teacherTwoId
var studentOneId;
var studentTwoId;
var assistantOneId;
var assistantTwoId;
var wrongId = '56a6d439558937d21b647828';

chai.use(chaiHttp);
describe('Manager: Register, Login and Post:', function() {
  before(function(done){
    User.collection.drop();
    done();
  });
  after(function(done){
    User.collection.drop();
    done();
  });
	it('should register login successfully', function(done) {
		chai.request(server)
				.post('/Mapi/Mregister')
				.send({account:'444444', password:'444444', name:'haha', email:"chenzl25@mail2.sysu.edu.cn"})
				.then((res) => {
					expect(res.body.error).equal(false);	
					agent = chai.request.agent(server);
					agent
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
		agent
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
		agent
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
		agent
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
		agent
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
		agent
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
		agent
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
		agent
			.post('/Mapi/class')
			.send({name:'class123'})
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				classId = res.body.classData._id;
				done();
			});
	});
	it('create group ', function(done) {
		agent
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
		agent
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
		agent
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
		agent
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
	it('search teacher to validate his class is correct', function(done) {
		agent
			.get('/Mapi/user/'+teacherOneId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.classId).equal(classId);
				done();
			});
	});
	it('add student for group successfully', function(done) {
		agent
			.post('/Mapi/group/'+groupOneId+'/student/'+studentOneId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.studentsId).to.has.length(1);
				done();
			});
	});
	it('add student for group successfully', function(done) {
		agent
			.post('/Mapi/group/'+groupTwoId+'/student/'+studentTwoId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.studentsId).to.has.length(1);
				done();
			});
	});
	it('add assistant for group successfully', function(done) {
		agent
			.post('/Mapi/group/'+groupOneId+'/assistant/'+assistantOneId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body.error).equal(false);
				expect(res.body.groupData.assistantsId).to.has.length(1);
				done();
			});
	});
	it('add assistant for group successfully', function(done) {
		agent
			.post('/Mapi/group/'+groupTwoId+'/assistant/'+assistantTwoId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body.error).equal(false);
				expect(res.body.groupData.assistantsId).to.has.length(1);
				done();
			});
	});
	it('find class', function(done) {
		agent
			.get('/Mapi/class/'+classId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body.error).equal(false);
				expect(res.body.classData).to.be.a('object');
				expect(res.body.classData).to.has.property('_id');
				expect(res.body.classData._id).equal(classId);
				done();
			});
	});
	it('delete the class successfully', function(done) {
		agent.delete('/Mapi/class/'+classId)
				 .end(function(err, res) {
				 	console.log(res.body);
				 	expect(res.body.error).equal(false);
				 	done();
				 })
	})
	it('search member in the group(or class) has been deleted, to see the groupOneId', function(done) {
		agent
			.get('/Mapi/user/'+studentOneId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.groupId).equal(null);
				done();
			});
	});
	it('search member in the group(or class) has been deleted, to see the groupOneId', function(done) {
		agent
			.get('/Mapi/user/'+assistantOneId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.groupId).equal(null);
				done();
			});
	});
	it('search teacher in the class has been deleted, to see the groupOneId', function(done) {
		agent
			.get('/Mapi/user/'+teacherOneId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.classId).equal(null);
				done();
			});
	});
	it('search member in the group(or class) has been deleted, to see the groupTwoId', function(done) {
		agent
			.get('/Mapi/user/'+studentTwoId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.groupId).equal(null);
				done();
			});
	});
	it('search member in the group(or class) has been deleted, to see the groupTwoId', function(done) {
		agent
			.get('/Mapi/user/'+assistantTwoId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.groupId).equal(null);
				done();
			});
	});
	it('search teacher in the class has been deleted, to see the groupTwoId', function(done) {
		agent
			.get('/Mapi/user/'+teacherTwoId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.classId).equal(null);
				done();
			});
	});
	it('find class', function(done) {
		agent
			.get('/Mapi/class/'+classId)
			.end(function(err, res) {
				expect(res.body.error).equal(true);
				expect(res.body.message).equal('该班级不存在');
				done();
			});
	});
});

