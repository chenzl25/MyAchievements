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

var agent;  // use this to the thing needed auth
var classId; 
var groupId;
var teacherId;
var studentId;
var assistantId;
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
	it('register only by name', function(done) {
		chai.request(server)
				.post('/Mapi/Mregister')
				.send({'name':'dylan'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).to.have.length(3);
					expect(res.body.message.indexOf('账号为空')).not.equal(-1);
					expect(res.body.message.indexOf('密码为空')).not.equal(-1);
					expect(res.body.message.indexOf('邮箱为空')).not.equal(-1);
					done();
				});
	});
	it('register only by account', function(done) {
		chai.request(server)
				.post('/Mapi/Mregister')
				.send({'account':'14331048'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).to.have.length(3);
					expect(res.body.message.indexOf('密码为空')).not.equal(-1);
					expect(res.body.message.indexOf('名字为空')).not.equal(-1);
					expect(res.body.message.indexOf('邮箱为空')).not.equal(-1);
					done();
				});
	});
	it('register only by password/manager', function(done) {
		chai.request(server)
				.post('/Mapi/Mregister')
				.send({'password':'111111'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).to.have.length(3);
					expect(res.body.message.indexOf('账号为空')).not.equal(-1);
					expect(res.body.message.indexOf('名字为空')).not.equal(-1);
					expect(res.body.message.indexOf('邮箱为空')).not.equal(-1);
					done();
				});
	});
	it('register unformat', function(done) {
		chai.request(server)
				.post('/Mapi/Mregister')
				.send({'account': '11111','password':'11111', 'name':'hahasadasdsasdadsaadsadadsa'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).to.have.length(4);
					expect(res.body.message.indexOf('用户名6~18位英文字母、数字')).not.equal(-1);
					expect(res.body.message.indexOf('密码6~18位英文字母、数字')).not.equal(-1);
					expect(res.body.message.indexOf('名字长度为2-20个字符')).not.equal(-1);
					expect(res.body.message.indexOf('邮箱为空')).not.equal(-1);
					done();
				});
	});
	it('register successfully', function(done) {
		chai.request(server)
				.post('/Mapi/Mregister')
				.send({'account':'111111', 'password':'111111', 'name':'dylan', 'email':"595084778@qq.com"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
					done();
				});
	});
	it('register already have registerd', function(done) {
		chai.request(server)
				.post('/Mapi/Mregister')
				.send({'account':'111111', 'password':'111111', 'name':'dylan', 'email':"595084778@qq.com"})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).equal('账号已被注册');
					done();
				});
	});
	it('login fail for password wrong', function(done) {
		chai.request(server)
				.post('/api/login')
				.send({'account':'111111', 'password':'11111112'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).equal('账号或密码错误');
					done();
				});
	});
	it('login fail', function(done) {
		chai.request(server)
				.post('/api/login')
				.send({'account':'123456', 'password':'14331048'})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					done();
				});
	});
	it('login successfully', function(done) {
		chai.request(server)
				.post('/api/login')
				.send({'account':'111111', 'password':'111111'})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData.position).equal('manager');
					done();
				});
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
					teacherId = res.body.userData._id;
					done();
				});
	});
	it('register successfully', function(done) {
		agent
				.post('/Mapi/register')
				.send({'account':'333333', 'password':'333333', 'name':'dylan', 'email':"595084778@qq.com", 'position':"student"})
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.userData).to.be.a('object');
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
					studentId = res.body.userData._id;
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
					assistantId = res.body.userData._id;
					done();
				});
	});
	it('register fail', function(done) {
		agent
				.post('/Mapi/register')
				.send({'account':'333333', 'password':'333333', 'name':'dylan', 'email':"595084778@qq.com", 'position':"manager"})
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message[0]).equal('权限格式错误');
					done();
				});
	});
	it('delete ', function(done) {
		agent
				.delete('/Mapi/user/333333')
				.end(function(err, res) {
					expect(res.body.error).equal(false);
					expect(res.body.message).equal('成功删除用户');
					done();
				});
	});
	it('delete ', function(done) {
		agent
				.delete('/Mapi/user/4444444')
				.end(function(err, res) {
					expect(res.body.error).equal(true);
					expect(res.body.message).equal('删除用户失败,该用户不存在')
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
				expect(res.body.groupData.classId).equal(classId);
				groupId = res.body.groupData._id;
				done();
			});
	});
	it('find class', function(done) {
		agent
			.get('/Mapi/class/'+classId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.classData).to.be.a('object');
				expect(res.body.classData).to.has.property('_id');
				expect(res.body.classData._id).equal(classId);
				done();
			});
	});
	it('add teacher for class successfully', function(done) {
		agent
			.post('/Mapi/class/'+classId+'/teacher/'+teacherId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.classData).to.be.a('object');
				expect(res.body.classData).to.has.property('_id');
				expect(res.body.classData._id).equal(classId);
				expect(res.body.classData.teachersId).to.be.a('array');
				expect(res.body.classData.teachersId.indexOf(teacherId)).not.equal(-1);
				done();
			});
	});
	it('search teacher to validate his class is correct', function(done) {
		agent
			.get('/Mapi/user/'+teacherId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.classsId.indexOf(classId)).not.equal(-1);
				done();
			});
	});
	it('add teacher for class fail', function(done) {
		agent
			.post('/Mapi/class/'+classId+'/teacher/'+wrongId)
			.end(function(err, res) {
				expect(res.body.error).equal(true);
				// expect(res.body.classData).to.be.a('object');
				// expect(res.body.classData).to.has.property('_id');
				// expect(res.body.classData._id).equal(classId);
				done();
			});
	});
	it('add student for group successfully', function(done) {
		agent
			.post('/Mapi/group/'+groupId+'/student/'+studentId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.studentsId).to.has.length(1);
				done();
			});
	});
	it('add assistant for group successfully', function(done) {
		agent
			.post('/Mapi/group/'+groupId+'/assistant/'+assistantId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.assistantsId).to.has.length(1);
				done();
			});
	});
	it('search teacher to validate his class is correct', function(done) {
		agent
			.get('/Mapi/user/'+studentId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.groupsId.indexOf(groupId)).not.equal(-1);
				done();
			});
	});
	it('delete student from group successfully', function(done) {
		agent
			.delete('/Mapi/group/'+groupId+'/member/'+studentId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData).to.be.a('object');
				expect(res.body.groupData.studentsId.indexOf(studentId)).equal(-1);
				done();
			});
	});
	it('search student who has been deleted from a group', function(done) {
		agent
			.get('/Mapi/user/'+studentId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.groupsId.indexOf(groupId)).equal(-1);
				done();
			});
	});
	it('delete assistant from group successfully', function(done) {
		agent
			.delete('/Mapi/group/'+groupId+'/member/'+assistantId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData).to.be.a('object');
				expect(res.body.groupData.assistantsId.indexOf(assistantId)).equal(-1);
				done();
			});
	});
	it('add student for group successfully again', function(done) {
		agent
			.post('/Mapi/group/'+groupId+'/student/'+studentId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.studentsId).to.has.length(1);
				done();
			});
	});
	it('add assistant for group successfully again', function(done) {
		agent
			.post('/Mapi/group/'+groupId+'/assistant/'+assistantId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.groupData.assistantsId).to.has.length(1);
				done();
			});
	});
	it('find group successfully', function(done) {
		agent
			.get('/Mapi/group/'+groupId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				done();
			});
	});
	it('search member in the group has been deleted before, to see the groupId', function(done) {
		agent
			.get('/Mapi/user/'+studentId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.groupsId.indexOf(groupId)).not.equal(-1);
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
				expect(res.body.groupData.classId).equal(classId);
				done();
			});
	});
	it('delete total group successfully', function(done) {
		agent
			.delete('/Mapi/group/'+groupId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body.error).equal(false);
				done();
			});
	});
	it('search class to ensure the group has been deleted', function(done) {
		agent
			.get('/Mapi/class/'+classId)
			.end(function(err, res) {
				console.log(res.body)
				expect(res.body.error).equal(false);
				expect(res.body.classData.groupsId.indexOf(groupId)).equal(-1);

				done();
			});
	});
	it('find group fail', function(done) {
		agent
			.get('/Mapi/group/'+groupId)
			.end(function(err, res) {
				expect(res.body.error).equal(true);
				done();
			});
	});
	it('search member in the group has been deleted, to see the groupId', function(done) {
		agent
			.get('/Mapi/user/'+studentId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.groupsId.indexOf(groupId)).equal(-1);
				done();
			});
	});
	it('search member in the group has been deleted, to see the groupId', function(done) {
		agent
			.get('/Mapi/user/'+assistantId)
			.end(function(err, res) {
				expect(res.body.error).equal(false);
				expect(res.body.userData.groupsId.indexOf(groupId)).equal(-1);
				done();
			});
	});
});

