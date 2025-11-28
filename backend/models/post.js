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
    likeCount: {
        type: Number,
        default: 0,
    },
    // track which users liked the post to prevent double-likes
    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    ],
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
    // store comments within the post for simplicity
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    // track number of times a post was shared
    shareCount: {
        type: Number,
        default: 0,
    },
    default: []     
},{timestamps:true})

const Post = mongoose.model('postData',postSchema)
module.exports = Post