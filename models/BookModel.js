// 将Schema和Model:模式对象和模型对象的创建模块化
const mongoose = require('mongoose')

let BookSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // required: 必填项; unique: 不可重复(需要重建集合才能有效)
    author: { type: String, default: '匿名' }, // default: 默认值(缺失则以默认值填充)
    style: { type: String, enum: ['科幻', '玄幻', '都市', '言情'] }, // enum: 枚举，填入项必须是其中一项
    price: { type: Number }
})
// 创建模型对象
let BookModel = mongoose.model('books', BookSchema)

module.exports = BookModel