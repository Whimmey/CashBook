var express = require('express');
var router = express.Router();
// 导入lowdb
// const low = require('lowdb')
// const FileSync = require('lowdb/adapters/FileSync')
// const adapter = new FileSync(__dirname + '/../data/db.json')
// const db = low(adapter) // db对象
// nanoid
const { nanoid } = require('nanoid')
// moment插件格式化date字符串
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
const checkLoginMidWare = require('../../middlewares/checkLoginMidWare') // 登录状态中间件检测

router.get('/', (req, res) => {
  res.redirect('account')
})
// 记账本列表
router.get('/account', checkLoginMidWare, function (req, res, next) {
  AccountModel.find().sort({ date: -1 }).then((data, err) => {
    if (err) {
      res.status(500).send('数据读取失败！')
      console.log(err);
      return;
    }
    res.render('list', { title: 'Cash List', accounts: data, toasttrigger: false, moment: moment });
  })
});

// 记账本列表
router.get('/account/create', function (req, res, next) {
  res.render('create', { title: 'Create Item' });
});

// 接收create的数据
router.post('/account', (req, res) => {
  // db.get('accounts').unshift({ id: nanoid(), ...req.body }).write() // ...req.body扩展运算符 unshift保证新加入的排在前面
  AccountModel.create({
    // ...req.body, time: new Date(req.body.date)
    ...req.body, date: moment(req.body.date).toDate()
  }).then((data, err) => {
    if (err) {
      res.render('success', { title: 'Failed' })
      console.log(err);
      return;
    }
    console.log(data);
    res.render('success', { title: 'Success' })
  })
})

// 删除操作
router.get('/account/:id', (req, res) => {
  let id = req.params.id
  AccountModel.deleteOne({ _id: id }).then((data, err) => {
    if (err) {
      res.render('success', { title: 'Failed' })
      console.log(err);
      return;
    }
    // console.log(data); // { acknowledged: true, deletedCount: 1 }
    res.render('success', { title: 'Success' })
    // if (err) {
    //   res.status(500).send('数据删除失败！')
    //   console.log(err);
    //   return;
    // }
    // res.render('list', { title: 'Cash List', accounts: data, toasttrigger: true, moment: moment });
  })
})
module.exports = router;
