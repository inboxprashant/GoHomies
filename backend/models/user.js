const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
     name:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true,
        unique:true
     },
     password:{
        type:String,
        required:true,
     },
     username:{
      type:String,
      required:true,
      unique:true
     },
     title:{
      type:String
     },
     designation:{
      type:String
     },
     about:{
      type:String
     }
},{timestamps:true})

const User = mongoose.model('users',userSchema);

module.exports = User 