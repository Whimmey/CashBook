"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var router = express.Router(); // 导入lowdb

var low = require('lowdb');

var FileSync = require('lowdb/adapters/FileSync');

var adapter = new FileSync(__dirname + '/../data/db.json'); // db对象

var db = low(adapter); // nanoid

var _require = require('nanoid'),
    nanoid = _require.nanoid; // moment插件格式化date字符串


var moment = require('moment');

var AccountModel = require('../models/AccountModel'); // Set some defaults
// db.defaults({ accounts: [] }).write()
// 记账本列表


router.get('/account', function (req, res, next) {
  AccountModel.find().sort({
    date: -1
  }).then(function (data, err) {
    if (err) {
      res.status(500).send('数据读取失败！');
      console.log(err);
      return;
    }

    res.render('list', {
      title: 'Cash List',
      accounts: data,
      toasttrigger: false,
      moment: moment
    });
  });
}); // 记账本列表

router.get('/account/create', function (req, res, next) {
  res.render('create', {
    title: 'Create Item'
  });
}); // 接收create的数据

router.post('/account', function (req, res) {
  // db.get('accounts').unshift({ id: nanoid(), ...req.body }).write() // ...req.body扩展运算符 unshift保证新加入的排在前面
  AccountModel.create(_objectSpread({}, req.body, {
    date: moment(req.body.date).toDate()
  })).then(function (data, err) {
    if (err) {
      res.render('success', {
        title: 'Failed'
      });
      console.log(err);
      return;
    }

    console.log(data);
    res.render('success', {
      title: 'Success'
    });
  });
}); // 删除操作

router.get('/account/:id', function (req, res) {
  var id = req.params.id;
  AccountModel.deleteOne({
    _id: id
  }).then(function (data, err) {
    if (err) {
      res.render('success', {
        title: 'Failed'
      });
      console.log(err);
      return;
    } // console.log(data); // { acknowledged: true, deletedCount: 1 }


    res.render('success', {
      title: 'Success'
    }); // if (err) {
    //   res.status(500).send('数据删除失败！')
    //   console.log(err);
    //   return;
    // }
    // res.render('list', { title: 'Cash List', accounts: data, toasttrigger: true, moment: moment });
  });
});
module.exports = router;