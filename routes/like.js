const express = require('express');
const router = express.Router();
const Like = require('../models/likes');
const Post = require('../models/posts');
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");

// Like a post
router.post('/posts/:id/like', isLoggedIn, wrapAsync(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;
  const post=await Post.findById(postId);
  // Create a new like
  const like = new Like({ user: userId, post: postId });
  await like.save();
  console.log("new like saved");
 
  //increase likescount on like the post

    post.likesCount += 1; // Increment likesCount
    await post.save();
     


  // Optionally, associate the like with the post
  await Post.findByIdAndUpdate(postId, { $push: { likes: like._id } });

  // Return the updated like count
  const likeCount = await Like.countDocuments({ post: postId });
  res.status(200).json({ message: 'Post liked!', likeCount });
}));

module.exports = router;
