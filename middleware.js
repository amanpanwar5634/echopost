const Post=require("./models/posts");
const Comment=require("./models/comment.js");
module.exports.isLoggedIn= (req,res,next)=>{     //to check person is login or not to create routes or anything if not then 
if(!req.isAuthenticated()){
    console.log(req.originalUrl);
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must loggedin!!");
    console.log(req.flash);
    return  res.redirect("/login");
}
next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{ //after login you go to that route which you want to be
if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
}
next();
}
module.exports.isOwner= async (req,res,next)=>{  //to prevent another user to changes in post 
    let {id}=req.params;
  let post= await Post.findById(id);
  if(!post.owner.equals(res.locals.currUser._id)){
    req.flash("error","You have no authority to do changes!!");
    return res.redirect(`/posts/${id}`);
  }
  next();
}

module.exports.isAuthor= async (req,res,next)=>{  //to prevent another user to changes in comments 
  let {id,commentId}=req.params;
let comment= await Comment.findById(commentId);
if(!comment.author.equals(res.locals.currUser._id)){
  req.flash("error","You have no authority to do changes!!");
  return res.redirect(`/posts/${id}`);
}
next(); 
}