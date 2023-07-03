var express = require('express');
var router = express.Router();
// moment插件格式化date字符串
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

// 导入Token校验中间件
const checkTokenLoginMidWare = require('../../middlewares/checkTokenMidWare')
// api接口的区别在于返回的是json数据，而不是渲染模板
// 记账本列表
router.get('/account', checkTokenLoginMidWare, function (req, res, next) {
    console.log(req.user);
    // token无误 执行读取代码
    AccountModel.find().sort({ date: -1 }).then((data, err) => {
        if (err) {
            // 相应失败也直接返回json数据，不用设置状态码
            res.json({
                code: '1001',
                msg: 'get failed',
                data: null
            })
            return;
        }
        // 这里和web/index.js不同，因为api/index.js是给前端ajax调用的，所以返回json数据
        res.json({
            code: '0000',
            msg: 'get success',
            data: data
        })
    })

});

// 记账本列表 接口服务不需要返回html
// router.get('/account/create', function (req, res, next) {
//     res.render('create', { title: 'Create Item' });
// });

// 接收create的数据
router.post('/account', checkTokenLoginMidWare, (req, res) => {
    // 这里可以进行表单验证
    AccountModel.create({
        // ...req.body, time: new Date(req.body.date)
        ...req.body, date: moment(req.body.date).toDate()
    }).then((data, err) => {
        if (err) {
            res.json({
                code: '1002',
                msg: 'create failed',
                data: null
            })
            return;
        }
        res.json({
            code: '0000',
            msg: 'create success',
            data: data
        })
    })
})

// 删除操作 注意这里方法换成了delete
router.delete('/account/:id', checkTokenLoginMidWare, (req, res) => {
    let id = req.params.id
    AccountModel.deleteOne({ _id: id }).then((data, err) => {
        if (err) {
            res.json({
                code: '1003',
                msg: 'delete failed',
                data: null
            })
            return;
        }
        res.json({
            code: '0000',
            msg: 'delete item success',
            data: {}
        })
    })
})

// 获取单个item
router.get('/account/:id', checkTokenLoginMidWare, (req, res) => {
    let { id } = req.params
    AccountModel.findById(id).then((data, err) => {
        if (err) {
            res.json({
                code: '1004',
                msg: 'read failed',
                data: null
            })
        }
        res.json({
            code: '0000',
            msg: 'read success',
            data: data
        })
    })
})

// 更新账单操作 修改
router.patch('/account/:id', checkTokenLoginMidWare, (req, res) => {
    let id = req.params.id
    AccountModel.updateOne({ _id: id }, req.body).then((data, err) => {
        if (err) {
            res.json({
                code: '1005',
                msg: 'revise failed',
                data: null
            })
        }
        // 再次查询数据库 获取单条信息
        AccountModel.findById(id).then((data, err) => {
            if (err) {
                return res.json({
                    code: '1004',
                    msg: 'get failed',
                    data: null
                })
            }
            res.json({
                code: '0000',
                msg: 'update success',
                data: data
            })
        })
    })
})
module.exports = router;
