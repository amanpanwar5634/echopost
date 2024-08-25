const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema= new Schema({
    email:{type:String,
        required:true
    }
})
userSchema.plugin(passportLocalMongoose); //it automatically do hashing,salting in username,password
const User=new mongoose.model("User",userSchema);
module.exports=User;