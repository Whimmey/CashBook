"use strict";

var express = require('express');

var router = express.Router();

var UserModel = require('../../models/UserModel');

var md5 = require('md5'); // 引入单向加密算法MD5


var jwt = require('jsonwebtoken'); // 导入jwt


var _require = require('../../config/config'),
    SECRET = _require.SECRET; // router.get('/reg', (req, res) => {
//     res.render('reg', { title: 'Regist' })
// })
// router.post('/reg', (req, res) => {
//     // 对密码使用MD5加密
//     UserModel.create({
//         ...req.body, password: md5(req.body.password)
//     }).then(data => {
//         console.log(data);
//         res.render('login', { title: 'Login' })
//     }, err => {
//         res.status(500).send('注册失败!')
//         return
//     })
// })


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
      return res.json({
        code: '2002',
        msg: '用户名或密码错误',
        data: null
      });
    } // 创建 token


    var token = jwt.sign({
      username: data.username,
      _id: data._id
    }, SECRET, {
      expiresIn: 60 * 60
    }); // 响应 token

    res.json({
      code: '0000',
      msg: '登录成功',
      data: token
    });
  }, function (err) {
    res.status(500).send('登录失败');
    res.json({
      code: '2001',
      msg: '数据库读取失败',
      data: null
    });
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