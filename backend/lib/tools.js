var debug = require('debug')('api:tools');
var fs = require('fs');
var path = require('path');
module.exports.checkLoginMiddleware = function(req, res, next) {
  if (req.session.userData) {
    next();
  } else {
    res.json({error:true, message: '你还没登陆'});
  }
}
module.exports.checkManagerMiddleware = function (req, res, next) {
  if (req.session.userData.position == 'manager') {
    next();
  } else {
    res.json({error:true, message: '你不是管理员'});
  }
}

module.exports.checkTeacherMiddleware = function (req, res, next) {
  if (req.session.userData.position == 'teacher') {
    next();
  } else {
    res.json({error:true, message: '你不是教师'});
  }
}
module.exports.checkStudentMiddleware = function (req, res, next) {
  if (req.session.userData.position == 'student') {
    next();
  } else {
    res.json({error:true, message: '你不是学生'});
  }
}
module.exports.checkAssistantMiddleware = function (req, res, next) {
  if (req.session.userData.position == 'assistant') {
    next();
  } else {
    res.json({error:true, message: '你不是助教'});
  }
}
module.exports.invalidDataHandler = function (err) {
    // err is our ValidationError object
    // err.errors.password is a ValidatorError object
    if (err) {
        console.log(err);
        console.log('Attention!');
        console.log('--------------the save() failed----------------------');
        for (var i in err.errors) {
            console.log(err.errors[i].message); // prints 'Validator "Invalid password" failed for path password with value `grease`'
            console.log(err.errors[i].kind);  // prints "Invalid password"
            console.log(err.errors[i].path);  // prints "password"
            console.log(err.errors[i].value); // prints "vlue of password"
        }
        console.log('-----------------------------------------------------');
    } else {
        console.log('save successfully');
    }
}
module.exports.validateMiddleware = function(validatorFunc) {
  return function (req, res, next) {
    debug(req.body);
    var validateResult = validatorFunc(req.body);
    if (validateResult) {
      res.json({error: true, message: validateResult});
    } else {
      next();
    }
  }
}
module.exports.checkSourceAndImageAllUploadMiddleware = function(req, res, next) {
  if (!req.body.source && !req.body.image)
    res.json({error: true, message: '预览图和源文件都没有上传'})
  else if (!req.body.source && req.body.image) {
    deleteImage(req.body.image).catch(err => debug(err))
    res.json({error: true, message: '源文件没有上传'})
  } else if (req.body.source && !req.body.image) {
    deleteSource(req.body.source).catch(err => debug(err))
    res.json({error: true, message: '预览图没有上传'})
  } else
    next();
}
function deleteImage(imageAddress) {
  var addr = path.join(__dirname, '..', 'uploads', 'homeworks', imageAddress);
  return new Promise((resolve, reject) => {
    fs.unlink(addr, function(err) {
      if (err) reject(err);
      else resolve('ok');
    })
  });
}
function deleteSource(sourceAddress) {
  var addr = path.join(__dirname, '..', 'uploads', 'homeworks', sourceAddress);
  return new Promise((resolve, reject) => {
    fs.unlink(addr, function(err) {
      if (err) reject(err);
      else resolve('ok');
    })
  });
}
module.exports.deleteImage = deleteImage;
module.exports.deleteSource = deleteSource;