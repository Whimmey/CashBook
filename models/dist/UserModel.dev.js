"use strict";

// 将Schema和Model:模式对象和模型对象的创建模块化
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}); // 创建模型对象

var UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;