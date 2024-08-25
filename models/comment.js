const mongoose=require("mongoose");
const {Schema}=mongoose;
const commentSchema=new Schema({
    comment:String,
    commented_at:{type:Date,default:Date.now()},
    author:{type:Schema.Types.ObjectId,ref:'User'},
    
});
module.exports=mongoose.model("Comment",commentSchema);
