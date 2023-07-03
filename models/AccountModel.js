// 将Schema和Model:模式对象和模型对象的创建模块化
const mongoose = require('mongoose')

let AccountSchema = new mongoose.Schema({
    item: { type: String, required: true }, // required: 必填项; unique: 不可重复(需要重建集合才能有效)
    date: { type: Date }, // default: 默认值(缺失则以默认值填充)
    type: { type: String, enum: [1, -1], default: -1 }, // enum: 枚举，填入项必须是其中一项
    account: { type: Number, required: true },
    des: String
})
// 创建模型对象
let AccountModel = mongoose.model('accounts', AccountSchema)

module.exports = AccountModel