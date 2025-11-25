const Post = require("../models/post")

async function CreateNewPost(req,res){
    const {destination,totalPersons,TravelMonth,BudgetPerPerson,description} = req.body;
    const userId = req.user._id

  await Post.create({
    destination,totalPersons,TravelMonth,BudgetPerPerson,description,userId
  })

  return res.status(201).json({msg:"Post Created Successfully"})
}

async function getAllPost(req,res){
    try {
        const posts = await Post.find()
        .populate("userId",'name email username about designation title')
        .sort({createdAt:-1})

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({msg:"Something Went wrong"})
    }
}

// Opt-in function
async function optInToPost(req, res) {
    const postId = req.params.postId;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ msg: "Post not found" });

        if (!post.interested_persons.includes(userId)) {
            post.interested_persons.push(userId);
            await post.save();
        }

        return res.status(200).json({ msg: "Opted in successfully" });
    } catch (err) {
        return res.status(500).json({ msg: "Error opting in", error: err.message });
    }
}

// Opt-out function
async function optOutFromPost(req, res) {
    const postId = req.params.postId;
    const userId = req.user._id;
    console.log(userId)

    try {
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ msg: "Post not found" });

        post.interested_persons = post.interested_persons.filter(
            (id) => id.toString() !== userId.toString()
        );

        await post.save();

        return res.status(200).json({ msg: "Opted out successfully" });
    } catch (err) {
        return res.status(500).json({ msg: "Error opting out", error: err.message });
    }
}


module.exports = {CreateNewPost,getAllPost,optInToPost,optOutFromPost}