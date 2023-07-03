"use strict";

/**  
*@param {*} success 数据库连接成功的回调
*@param {*} error  数据库连接失败的回调
**/
// 拆分出重复使用的回调
module.exports = function (success, error) {
  // 可选优化：这样就可以省略index.js中的error回调
  if (typeof error !== 'function') {
    error = function error() {
      console.log('连接失败');
    };
  }

  var mongoose = require('mongoose'); // 加载模块化的配置文件


  var _require = require('../config/config'),
      DBHOST = _require.DBHOST,
      DBPORT = _require.DBPORT,
      DBNAME = _require.DBNAME; // 连接数据库


  mongoose.connect("mongodb://".concat(DBHOST, ":").concat(DBPORT, "/").concat(DBNAME));
  mongoose.connection.once('open', function () {
    success();
  });
  mongoose.connection.on('error', function () {
    error();
  });
  mongoose.connection.on('close', function () {}); // mongoose.disconnect() // 关闭连接
};