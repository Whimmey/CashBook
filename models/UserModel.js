// 将Schema和Model:模式对象和模型对象的创建模块化
const mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
})
// 创建模型对象
let UserModel = mongoose.model('users', UserSchema)

module.exports = UserModel