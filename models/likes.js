const mongoose=require("mongoose");
const {Schema}=mongoose;
const likeSchema=new Schema({
    user:{type:Schema.Types.ObjectId,ref:"User"},
    post:{type:Schema.Types.ObjectId,ref:"Post"},
},
{timestamps:true},);
likeSchema.index({ user: 1, post: 1 }, { unique: true });
const Like= mongoose.model('Like', likeSchema);
module.exports=Like;

