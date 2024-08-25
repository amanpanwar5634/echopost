const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Like = require('../models/likes');
const wrapAsync = require("../utils/wrapAsync");
router.get('/likedposts', isLoggedIn,wrapAsync(async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    // Find all likes by the user and populate the post field
    
    const likedPosts = await Like.find({ user: userId }).populate('post');
    console.log(likedPosts);
    // Now, likedPosts contains the full post document for each like
     res.render("./posts/like.ejs",{likedPosts});
  } catch (e) {
    req.flash('error', 'Unable to fetch liked posts.');
    res.redirect('/posts');
  }
}));

module.exports = router;
