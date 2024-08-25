if(process.env.NODE_ENV !="production"){
  require("dotenv").config();
}
console.log(process.env.SECRET);

const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");
const Post = require('./models/posts');
const wrapAsync = require("./utils/wrapAsync");
const { isLoggedIn } = require("./middleware");
const dbUrl=process.env.ATLASDB_URL;

 
const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{secret:process.env.SECRET},
  touchAfter:24*3600,
});
store.on("error",(err)=>{
  console.log("error in mongo session store",err);
});
const sessionOptions={
  store,
  secret:process.env.SECRET,
resave:false,
saveUninitialized:true,
cookie:{
  expires:Date.now()+30*24*3600*1000,
  maxAge:30*24*3600*1000,
  httpOnly:true,
}
};
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



const posts=require("./routes/posts.js");
const comments=require("./routes/comment.js");
const users=require("./routes/user.js");
const likes=require("./routes/like.js");
const likedpost=require("./routes/likedposts.js");
const userposts=require("./routes/userposts.js");
const usercomments=require("./routes/usercomment.js");
const mostliked=require("./routes/mostliked.js");


console.log(dbUrl);
main()
.then(()=>{console.log("connection successfull");})
.catch((err)=>{console.log("error is",err)});

async function main(){
  await  mongoose.connect(dbUrl);
}
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

 
app.use("/posts",posts);
app.use("/posts/:id/comments",comments);
app.use("/",users);
app.use("/",likes);
app.use("/",likedpost);
app.use("/",userposts);
app.use("/",usercomments);
app.use("/",mostliked);
app.get("/search",isLoggedIn,wrapAsync(async(req,res)=>{
  const {searchname}=req.query;
  const user=await User.findOne({username:searchname});
  if(user){
  const posts=await Post.find({owner:user.id}).sort({created_at:1});
  console.log(posts);
  res.render("./posts/search.ejs",{posts});}
  else{
    req.flash("error","no such user exist");
    res.redirect("/posts");
  }
}));

 //error handling middlewares
 app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found!"));
 });
 app.use((err,req,res,next)=>{
  let {statusCode="500",message="something went wrong"}=err;
  res.render("error.ejs",{message});
  
 })
app.listen(8080,()=>{console.log("app is listening ")});
 
//app.get("/",(req,res)=>res.send("home route"));