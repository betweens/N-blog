const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  //res.send('注册页')；
  res.render('signup/signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {

  const name = req.fields.username;
  const gender = req.fields.sex;
  const bio = req.fields.bio;
  const avatar = req.files.avatar.path.split(path.sep).pop();
  let password = req.fields.pwd;
  const repassword = req.fields.repwd;

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致')
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path);
    req.flash('error', e.message);
    return res.redirect('/signup');
  }

});

module.exports = router;
