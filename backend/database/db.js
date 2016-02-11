//built-in
var config = require('../config');
//middleware
var mongoose = require('mongoose');
//self
var User = require('./data').User;
ObjectId = mongoose.Schema.Types.ObjectId;

function init(useTestDataBase, callback) {
	if (useTestDataBase) {
		mongoose.connect(config.url_db_test, config.options);
	} else {
		mongoose.connect(config.url_db, config.options);
	}
	var db = mongoose.connection;

	//error
	db.on('error', function(err) {
		callback(err);
	});
	db.once('open', function () {
		var managerAccount = config.managerInfo.managerAccount;
		var managerPassword = config.managerInfo.managerPassword;
		var managerName = config.managerInfo.managerName;
		var managerEmail = config.managerInfo.managerEmail;
		User.remove({position: 'manager'})
				.then(()=> {
					User.register(managerAccount, managerPassword, managerName, managerEmail, 'manager')
							.then(userData => console.log('add manager successfully'),
										errorMessage => console.log(errorMessage, 'maybe the manager has been registerd'))
					callback(null);
				})
	});
}

module.exports.init = init;