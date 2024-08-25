const mongoose=require("mongoose");
const Comment=require("./comment.js");
const Schema=mongoose.Schema;
const postSchema=mongoose.Schema({
title:{type:String,
    required:true
},
caption:{type:String, 
},
image:{
     url:String,
     filename:String,
},
location:{type:String,
 required:true
},
country:{
    type:String,
    required:true
},
created_at:{
    type:Date,
    required:true,
},
comments:[{
    type:Schema.Types.ObjectId,
    ref:"Comment",
}],
owner:{
type:Schema.Types.ObjectId,
ref:"User"
},
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
likesCount: { type: Number, default: 0 }
})
const Post=mongoose.model("Post",postSchema);
module.exports=Post;