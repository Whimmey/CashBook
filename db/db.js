/**  
*@param {*} success 数据库连接成功的回调
*@param {*} error  数据库连接失败的回调
**/

// 拆分出重复使用的回调
module.exports = function (success, error) {
    // 可选优化：这样就可以省略index.js中的error回调
    if (typeof error !== 'function') {
        error = () => {
            console.log('连接失败');
        }
    }
    const mongoose = require('mongoose')
    // 加载模块化的配置文件
    const { DBHOST, DBPORT, DBNAME } = require('../config/config')
    // 连接数据库
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`)

    mongoose.connection.once('open', () => {
        success()
    })
    mongoose.connection.on('error', () => {
        error()
    })
    mongoose.connection.on('close', () => { })
    // mongoose.disconnect() // 关闭连接
}