const express = require('express');
const router = express.Router();

const PostsModel = require('../models/PostsModel');
const checkLogin = require('../middlewares/check').checkLogin;

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
	 const author = req.query.author;
  PostsModel.getPosts().then(function(result) {
  	res.render('posts/posts', {result: result });
  }).catch(next);
});

// GET /posts/create 发表文章页页面
router.get('/create', checkLogin, function (req, res, next) {
  res.render('posts/create');
});


// POST /posts/create 发表一篇文章接口
router.post('/create', checkLogin, function (req, res, next) {
  const title = req.fields.title;
  const content = req.fields.content;
  const author = req.session.user._id

  try {

  	if (!title.length) {
  		throw new Error('标题不能为空');
  	}

  	if (!content.length) {
  		throw new Error('内容不能为空');
  	}

  } catch(e) {
  	req.flash('error', e.message)
    return res.redirect('back')
  }

  let post = {
    author: author,
    title: title,
    content: content
  }

  PostsModel.create(post).then(function(result){
	   // 此 post 是插入 mongodb 后的值，包含 _id
    post = result.ops[0];
    req.flash('success', '发表成功')
    // 发表成功后跳转到该文章页
    res.redirect(`/posts/${post._id}`)
  }).catch(next);
});



// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
  // res.send('文章详情页');
  const postId = req.params.postId;

  Promise.all([
    PostsModel.getPostById(postId), // 获取文章信息
    PostsModel.incPv(postId)// pv 加 1
  ]).then(function (result) { 
      const post = result[0];
      if (!post) throw new Error('该文章不存在')
      res.render('posts/postsDetail', {result: [post] });
    }).catch(next);
});

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId;
  const author = req.session.user._id;

  PostsModel.getRawPostById(postId)
    .then(function (post) {
      if (!post) {
        throw new Error('该文章不存在')
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('权限不足')
      }

      console.log(post);

      res.render('posts/edit', {
        post: post
      })
    })
    .catch(next)
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {
  const postId = req.params.postId;
  const author = req.session.user._id;
  const title = req.fields.title;
  const content = req.fields.content;
	 
  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  PostsModel.getRawPostById(postId).then(function (post) {
    if (!post) {
      throw new Error('文章不存在')
    }
    if (post.author._id.toString() !== author.toString()) {
      throw new Error('没有权限')
    }
    PostsModel.updatePostById(postId, { title: title, content: content })
      .then(function () {
        req.flash('success', '编辑文章成功')
        // 编辑成功后跳转到上一页
        res.redirect(`/posts/${postId}`)
      })
      .catch(next)
  });
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
  res.send('删除文章');
});

module.exports = router;
