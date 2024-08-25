const express = require('express');
const router = express.Router();
const Like = require('../models/likes');
const Post = require('../models/posts');
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");

router.get("/mostliked",isLoggedIn,wrapAsync(async(req,res)=>{

const mostLikedPosts=await Post.find({}).sort({likesCount:-1}).limit(5);
console.log(mostLikedPosts);

res.render("./posts/mostliked.ejs",{mostLikedPosts});
}))
module.exports=router;