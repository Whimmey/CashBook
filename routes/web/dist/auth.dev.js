"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router();

var UserModel = require('../../models/UserModel');

var md5 = require('md5'); // 引入单向加密算法MD5


router.get('/reg', function (req, res) {
  res.render('reg', {
    title: 'Regist'
  });
});
router.post('/reg', function (req, res) {
  // 对密码使用MD5加密
  UserModel.create(_objectSpread({}, req.body, {
    password: md5(req.body.password)
  })).then(function (data) {
    console.log(data);
    res.render('login', {
      title: 'Login'
    });
  }, function (err) {
    res.status(500).send('注册失败!');
    return;
  });
});
router.get('/login', function (req, res) {
  res.render('login', {
    title: 'Login'
  });
});
router.post('/login', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;
  UserModel.findOne({
    username: username,
    password: md5(password)
  }).then(function (data) {
    // 密码对了data就是文档对象，错了就是null
    if (!data) {
      return res.send('账号或密码错误！');
    } // 写入Session数据并返回SessionID


    req.session.username = data.username;
    req.session._id = data._id; // 数据库文档中的_id

    res.render('success', {
      title: 'Login'
    });
  }, function (err) {
    res.status(500).send('登录失败');
    return;
  });
}); // 容易受到CSRF跨站请求攻击

router.post('/logout', function (req, res) {
  req.session.destroy(function () {
    res.render('success', {
      title: 'Logout'
    });
  });
});
module.exports = router;