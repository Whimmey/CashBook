"use strict";

var createError = require('http-errors');

var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser');

var logger = require('morgan');

var session = require('express-session');

var MongoStore = require('connect-mongo');

var indexRouter = require('./routes/web/index');

var authRouter = require('./routes/web/auth');

var apiRouter = require('./routes/api/index');

var apiAuthRouter = require('./routes/api/auth');

var _require = require('./config/config'),
    DBHOST = _require.DBHOST,
    DBPORT = _require.DBPORT,
    DBNAME = _require.DBNAME;

var app = express(); // Session中间件

app.use(session({
  name: 'sid',
  // cookie的name
  secret: 'mysession',
  // 参与加密的字符串(又称 签名)
  saveUninitialized: false,
  // 是否为每次加密都设置cookie来存储session的id
  resave: true,
  // 是否在每次请求时重新保存session
  store: MongoStore.create({
    mongoUrl: "mongodb://".concat(DBHOST, ":").concat(DBPORT, "/").concat(DBNAME) // 数据库连接配置

  }),
  cookie: {
    httpOnly: true,
    // 开启后前端无法通过JS操作(document.cookie)Cookie(安全)
    maxAge: 1000 * 60 * 60 * 24 // 控制sessionID的过期时间

  }
})); // view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/api', apiRouter);
app.use('/api', apiAuthRouter); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  res.render('404'); // next(createError(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;