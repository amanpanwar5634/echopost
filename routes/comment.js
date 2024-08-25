const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { commentSchema } = require("../utils/schema.js");
const Post = require("../models/posts.js");
const Comment = require("../models/comment.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");


//for unfill elements from backened,joi
const validateComment = (req, res, next) => {
  let ans = commentSchema.validate(req.body);
  if (ans.error) {
    let errMsg = ans.error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, ans.error);
  }
  else { next(); }
}

//comment post route
router.post("/", isLoggedIn, validateComment, wrapAsync(async (req, res) => {
  let post = await Post.findById(req.params.id);
  let newComment = new Comment(req.body.comment);
  newComment.author = req.user._id;
  console.log(newComment);
  post.comments.push(newComment);
  await newComment.save();
  await post.save();
  console.log(post);
  res.redirect(`/posts/${post.id}`);

}))
//comment delete route
router.delete("/:commentId", isLoggedIn, isAuthor, async (req, res) => {
  let { id, commentId } = req.params;
  await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  res.redirect(`/posts/${id}`);
})

module.exports = router;