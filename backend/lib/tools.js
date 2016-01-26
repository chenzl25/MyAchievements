var debug = require('debug')('api:tools');

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
    res.json({error:true, message: '你权限不够'});
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