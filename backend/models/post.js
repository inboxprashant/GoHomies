const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    destination:{
        type:String
    },
    totalPersons:{
        type:Number
    },
    TravelMonth:{
        type:String
    },
    BudgetPerPerson:{
        type:Number
    },
    description:{
        type:String
    },
    likeCount:{
        type:Number
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    interested_persons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ],
    default: []     
},{timestamps:true})

const Post = mongoose.model('postData',postSchema)
module.exports = Post