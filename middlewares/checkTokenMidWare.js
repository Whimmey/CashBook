const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/config')

module.exports = (req, res, next) => {
    // 校验token
    let token = req.get('token') // token一般放在请求头 定义名字为'token'
    if (!token) {
        return res.json({
            code: '2003',
            msg: '缺失',
            data: null
        })
    }
    jwt.verify(token, SECRET, (err, data) => {
        if (err) {
            return res.json({
                code: '2004',
                msg: 'token校验失败',
                data: null
            })
        }
        // 添加了属性保存用户信息 用于多用户
        req.user = data // 和req.session类似
        next()
    })
}