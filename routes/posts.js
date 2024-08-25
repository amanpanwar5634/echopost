const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { postSchema } = require("../utils/schema.js");
const Post = require("../models/posts.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer=require("multer");

const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//for unfill elements from backened,joi
const validatePost = (req, res, next) => {
  let ans = postSchema.validate(req.body);
  if (ans.error) {
    let errMsg = ans.error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, ans.error);
  }
  else { next(); }
}

//index route
router.get("/", wrapAsync(async (req, res) => {
  console.log("enter in index route");
  let allPosts = await Post.find({});
  res.render("./posts/index.ejs", { allPosts });
}))
//new route
router.get("/new", isLoggedIn, wrapAsync(async (req, res) => {
  res.render("./posts/new.ejs");
}))
//show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let post = await Post.findById(id).populate({
    path: "comments",
    populate: { path: "author" }
  })
    .populate("owner")
    .populate({
      path: "likes",      // Populate the `likes` field
    });

  if (!post) { throw new ExpressError(400, "No such post exist!!") }
  res.render("./posts/show.ejs", { post, likeCount: post.likes.length });
}))
//create route
router.post("/", isLoggedIn,upload.single("post[image]") ,validatePost,wrapAsync(async (req, res) => {
  let url=req.file.path;
  let filename=req.file.filename;
  console.log(url,filename);
  let newPost = await new Post(req.body.post);
  newPost.created_at = new Date();
  console.log(req.user);
  newPost.owner = req.user._id;
  newPost.image={url,filename};
  await newPost.save().then(() => { console.log("new post submitted") })
    .catch((err) => { console.log("error is ", err) });
  console.log("data is saved");
  req.flash("success", "You created a post!");
  res.redirect("/posts");
}));
//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const post = await Post.findById(id);
  res.render("./posts/edit.ejs", { post });
}))
//update route
router.put("/:id", isLoggedIn, isOwner,upload.single("post[image]") ,validatePost, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let post=await Post.findByIdAndUpdate(id, { ...req.body.post });
  if(typeof req.file!=="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
  post.image={url,filename};
    await post.save();}
  req.flash("success", "Post got updated!");
  res.redirect(`/posts/${id}`);
}));
//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Post.findByIdAndDelete(id);
  req.flash("success", "Post deleted successfully!");
  res.redirect(`/posts`);
}))

module.exports = router;