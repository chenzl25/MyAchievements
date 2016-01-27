//built-in
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');

//middleware
var debug = require('debug')('api:student');
var multer = require('multer');
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

var homeworkUpload = multer({ 
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', 'uploads', 'homeworks'));
    },
    filename: function (req, file, cb) {
    	if (file.fieldname == 'source') {
    		req.body.source = Date.now()+'__'+file.originalname;
      	cb(null, req.body.source);
    	} else if (file.fieldname == 'image') {
    		req.body.image = Date.now()+'__'+file.originalname;
      	cb(null, req.body.image);
    	} else {
    		cb(null, 'null');
    	}
    }
  }),
  limits: {
    fieldNameSize: 10,
    // fileSize: 512,
    files:2,
  },
  fileFilter: function  (req, file, cb) {
    debug(file);
    if (file.fieldname == 'source') {
    	if (/application\/(zip|x-bzip2|x-tar|x-rar-compressed|java-archive)/.test(file.mimetype))
    		cb(null, true);
    	else
    		cb({code:'HOMEWORK_SOURCE_FORMAT_ERROR'}, false);
    } else if (file.fieldname == 'image') {
	    if (/image\/*/.test(file.mimetype))
	      cb(null, true);
	    else
	      cb({code:'HOMEWORK_IMAGE_FORMAT_ERROR'}, false);
    } else {
    	cb(null, false);
    }
  }
});
// fieldname: 'image',
// originalname: 'abc.png',
// encoding: '7bit',
// mimetype: 'image/png',
// mimetype: 'application/zip',
// mimetype: 'application/x-bzip2',
// mimetype: 'application/x-tar'
// mimetype: 'application/x-rar-compressed'
// mimetype: 'application/java-archive'
router.use(tools.checkLoginMiddleware);
router.use(tools.checkStudentMiddleware);
router.post('/assignment/:assignmentId/homework', 
	tools.validateMiddleware(validator.validateCreateHomework.bind(validator)),
	homeworkUpload.any(), 
	function(req, res) {
	debug(req.body);
	if (!req.body.source && !req.body.image)
		res.json({error: true, message: '预览图和源文件都没有上传'})
	else if (!req.body.source && req.body.image) {
		fs.unlink(path.join(__dirname, '..', 'uploads', 'homeworks', req.body.image), function(err) {
	      if (err)
	        debug(err);
	      res.json({error: true, message: '源文件没有上传'})
	  });
	} else if (req.body.source && !req.body.image) {
		fs.unlink(path.join(__dirname, '..', 'uploads', 'homeworks', req.body.source), function(err) {
	      if (err)
	        debug(err);
	      res.json({error: true, message: '预览图没有上传'})
	  });
	} else
	  Homework.create(req.session.userData._id, req.params.assignmentId, req.body.source, req.body.image, req.body.github, req.body.message).then(
	    (homeworkData) => {
	      res.json({error: false, homeworkData:homeworkData});
	    },
	    (errorMessage) => {
	      res.json({error: true, message: errorMessage});
	    }
	  );
})
router.get('/assignment/:assignmentId', function(req, res) {
  Assignment.findById(req.params.assignmentId).then(
    (assignmentData) => {
      res.json({error: false, assignmentData: assignmentData});
    },
    (errorMessage) => {
      res.json({error: true, message: errorMessage});
    }
  )
});
router.use(function(err, req, res, next) {
	if (err.code == 'LIMIT_FIELD_KEY')
  	res.json({error: true, message:'上传作业的filed过长 '});
  else if (err.code == 'LIMIT_FILE_COUNT')
  	res.json({error: true, message:'上传作业文件过多'})
  else if (err.code == 'HOMEWORK_SOURCE_FORMAT_ERROR')
  	res.json({error: true, message: '上传作业源文件不是zip,bz2,tar,jar,rar的格式'})
  else if (err.code == 'HOMEWORK_IMAGE_FORMAT_ERROR')
  	res.json({error: true, message: '你上传的作业预览图可能格式不对'})
  else
  	res.json({error:true, message:'系统错误',err:err});
});


module.exports = router;