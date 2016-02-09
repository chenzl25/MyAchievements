var express = require('express');
var path = require('path');
var url = require('url');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var tools = require('./lib/tools');
var config = require('./config');
var loginRouter = require('./routes/loginRouter');
var studentRouter = require('./routes/studentRouter');
var assistantRouter = require('./routes/assistantRouter');
var teacherRouter = require('./routes/teacherRouter');
var managerRouter = require('./routes/managerRouter');
var indexRouter = require('./routes/indexRouter');
var changePasswordRouter = require('./routes/changePasswordRouter');
var quitRouter = require('./routes/quitRouter');

var app = express();

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(function(req, res, next) {
  if (req.url.indexOf('proxy/') !== -1) {
    req.url = req.url.slice('proxy/'.length);
  }
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(express.static(path.join(__dirname, 'uploads', 'homeworks')));
app.use(session({
  rolling:true,
  secret: 'blog_app',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1800000 },
  store: new MongoStore({
    url: config.url_sessions,
    ttl: 1800 // = 30 minutes. Default
  }),
}));

// app.use('/', indexRouter);
app.use('/Mapi', managerRouter);
app.use('/api', loginRouter);
app.use('/api', changePasswordRouter);
app.use('/api', quitRouter);
app.use('/Sapi', studentRouter);
app.use('/Aapi', assistantRouter);
app.use('/Tapi', teacherRouter);
// app.get('*', indexRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
