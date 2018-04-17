const express = require('express');
const router = express.Router();
const sha1 = require('sha1');

const UserModel = require('../models/usersModel');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {;
  res.render('login/login');
});

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {;
  const name = req.fields.username;
  const password = req.fields.pwd;
    // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  UserModel.getUserByName(name).then(function(result) {
  	console.log(result);


  	
  	if (!result) {
      req.flash('error', '用户不存在')
      return res.redirect('back')
    }

    // 检查密码是否匹配
    if (sha1(password) !== result.password) {
      req.flash('error', '用户名或密码错误')
      return res.redirect('back')
    }

    req.flash('success', '登录成功');
    // 用户信息写入 session
    delete result.password;
    req.session.user = result;
    // 跳转到主页
    res.redirect('/posts');

  }).catch(next);
});

module.exports = router;