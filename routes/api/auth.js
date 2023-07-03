const express = require('express')
const router = express.Router()
const UserModel = require('../../models/UserModel')
const md5 = require('md5') // 引入单向加密算法MD5
const jwt = require('jsonwebtoken') // 导入jwt
const { SECRET } = require('../../config/config')

// router.get('/reg', (req, res) => {
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

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body
    UserModel.findOne({ username: username, password: md5(password) }).then(data => {
        // 密码对了data就是文档对象，错了就是null
        if (!data) {
            return res.json({
                code: '2002',
                msg: '用户名或密码错误',
                data: null
            })
        }
        // 创建 token
        let token = jwt.sign({
            username: data.username,
            _id: data._id
        }, SECRET, {
            expiresIn: 60 * 60
        })
        // 响应 token
        res.json({
            code: '0000',
            msg: '登录成功',
            data: token
        })
    }, err => {
        res.status(500).send('登录失败')
        res.json({
            code: '2001',
            msg: '数据库读取失败',
            data: null
        })
        return
    })
})
// 容易受到CSRF跨站请求攻击
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('success', { title: 'Logout' })
    })
})

module.exports = router