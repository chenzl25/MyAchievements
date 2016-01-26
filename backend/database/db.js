//built-in
var config = require('../config');
//middleware
var mongoose = require('mongoose');
//self
var User = require('./User');
var Post = require('./Post');

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
		callback(null);
	});
}

module.exports.init = init;