const Comment = require('../lib/models').Comment;

module.exports = {
	 // 创建一个留言
  create: function create (comment) {
    return Comment.create(comment).exec()
  },

}