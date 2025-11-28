const Post = require("../models/post");

async function CreateNewPost(req, res) {
    try {
        console.log("user:", req.user);
        
        if (!req.user) {
            return res.status(401).json({ msg: "Not authenticated" });
        }

        const { destination, totalPersons, TravelMonth, BudgetPerPerson, description } = req.body;

        const post = await Post.create({
            destination,
            totalPersons,
            TravelMonth,
            BudgetPerPerson,
            description,
            userId: req.user._id
        });

        return res.status(201).json({ msg: "Post Created Successfully", post });
    } catch (err) {
        console.log("Create post error:", err);
        return res.status(500).json({ msg: "Failed to create post", error: err.message });
    }
}

async function getAllPost(req, res) {
    try {
        const posts = await Post.find()
            .populate("userId", "name email username about designation title")
            .sort({ createdAt: -1 });

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

async function optInToPost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

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

async function optOutFromPost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

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

module.exports = { CreateNewPost, getAllPost, optInToPost, optOutFromPost };
