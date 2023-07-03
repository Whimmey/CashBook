"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router(); // moment插件格式化date字符串

var moment = require('moment');

var AccountModel = require('../../models/AccountModel'); // 导入Token校验中间件


var checkTokenLoginMidWare = require('../../middlewares/checkTokenMidWare'); // api接口的区别在于返回的是json数据，而不是渲染模板
// 记账本列表


router.get('/account', checkTokenLoginMidWare, function (req, res, next) {
  console.log(req.user); // token无误 执行读取代码

  AccountModel.find().sort({
    date: -1
  }).then(function (data, err) {
    if (err) {
      // 相应失败也直接返回json数据，不用设置状态码
      res.json({
        code: '1001',
        msg: 'get failed',
        data: null
      });
      return;
    } // 这里和web/index.js不同，因为api/index.js是给前端ajax调用的，所以返回json数据


    res.json({
      code: '0000',
      msg: 'get success',
      data: data
    });
  });
}); // 记账本列表 接口服务不需要返回html
// router.get('/account/create', function (req, res, next) {
//     res.render('create', { title: 'Create Item' });
// });
// 接收create的数据

router.post('/account', checkTokenLoginMidWare, function (req, res) {
  // 这里可以进行表单验证
  AccountModel.create(_objectSpread({}, req.body, {
    date: moment(req.body.date).toDate()
  })).then(function (data, err) {
    if (err) {
      res.json({
        code: '1002',
        msg: 'create failed',
        data: null
      });
      return;
    }

    res.json({
      code: '0000',
      msg: 'create success',
      data: data
    });
  });
}); // 删除操作 注意这里方法换成了delete

router["delete"]('/account/:id', checkTokenLoginMidWare, function (req, res) {
  var id = req.params.id;
  AccountModel.deleteOne({
    _id: id
  }).then(function (data, err) {
    if (err) {
      res.json({
        code: '1003',
        msg: 'delete failed',
        data: null
      });
      return;
    }

    res.json({
      code: '0000',
      msg: 'delete item success',
      data: {}
    });
  });
}); // 获取单个item

router.get('/account/:id', checkTokenLoginMidWare, function (req, res) {
  var id = req.params.id;
  AccountModel.findById(id).then(function (data, err) {
    if (err) {
      res.json({
        code: '1004',
        msg: 'read failed',
        data: null
      });
    }

    res.json({
      code: '0000',
      msg: 'read success',
      data: data
    });
  });
}); // 更新账单操作 修改

router.patch('/account/:id', checkTokenLoginMidWare, function (req, res) {
  var id = req.params.id;
  AccountModel.updateOne({
    _id: id
  }, req.body).then(function (data, err) {
    if (err) {
      res.json({
        code: '1005',
        msg: 'revise failed',
        data: null
      });
    } // 再次查询数据库 获取单条信息


    AccountModel.findById(id).then(function (data, err) {
      if (err) {
        return res.json({
          code: '1004',
          msg: 'get failed',
          data: null
        });
      }

      res.json({
        code: '0000',
        msg: 'update success',
        data: data
      });
    });
  });
});
module.exports = router;