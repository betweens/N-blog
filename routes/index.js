// 网站主页
module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts')
  })
  app.use('/signup', require('./signup')); // 用户注册页面
  app.use('/signin', require('./signin')); // 用户登录页面
  app.use('/signout', require('./signout')); // 用户登出
  app.use('/posts', require('./posts')); // 发布文章
  app.use('/comments', require('./comments')); // 评论文档
}
