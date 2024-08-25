const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const { isLoggedIn } = require("../middleware");
const User = require("../models/user.js");
const Comment = require("../models/comment.js");
router.get("/usercomments",isLoggedIn,async(req,res)=>{
    const userId=req.user._id;
    const comments=await Comment.find({author:userId});
    res.render("./posts/usercomment.ejs",{comments});

});
module.exports=router;