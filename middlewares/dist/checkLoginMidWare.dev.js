"use strict";

// 检测登录
module.exports = function (req, res, next) {
  // 如果没有Session 用户未登录
  if (!req.session.username) {
    return res.redirect('/login');
  }

  next();
};