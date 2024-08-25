const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const { isLoggedIn } = require("../middleware");

router.get("/userposts",isLoggedIn,async(req,res)=>{
    const userId=req.user._id;
    const posts=await Post.find({owner:userId});
      
    console.log(posts);
    res.render("./posts/userpost.ejs",{posts});

});
module.exports=router;