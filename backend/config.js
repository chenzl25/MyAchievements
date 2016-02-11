var options = {
  db: {},
  server: { poolSize: 5 },
  user: '',
  pass: '',
};
module.exports.managerInfo = {
  managerAccount : 'manager',
  managerPassword : 'manager',
  managerName : 'Manager',
  managerEmail : '595084778@qq.com'
}
var url_sessions = 'mongodb://localhost:27017/MyAchievementSessions';
var url_db = 'mongodb://localhost:27017/MyAchievementApp';
var url_db_test = 'mongodb://localhost:27017/MyAchievementTests';
module.exports.options = options;
module.exports.url_sessions = url_sessions;
module.exports.url_db = url_db;
module.exports.url_db_test = url_db_test;
// module.exports.host = '172.18.68.129';
module.exports.host = 'localhost';
module.exports.port = 3000;
