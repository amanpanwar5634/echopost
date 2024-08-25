const mongoose=require("mongoose");
const Post=require("../models/posts.js");
const initData=require("./data.js");

main()
.then(()=>{console.log("connected to db");})
.catch((err)=>{console.log("error is",err)});

async function main(){
  await  mongoose.connect('mongodb://127.0.0.1:27017/posts');
}
const initDb=async()=>{
    await Post.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"66beecd8d34fc6cebc2aa519"}))
    await Post.insertMany(initData.data);
    console.log("data is initialize");
}
initDb();