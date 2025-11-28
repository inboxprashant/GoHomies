const Post = require("../models/post");

// Create a new post. Reads from req.body and attaches req.user._id as userId
async function createPost(req, res) {
    try {
        console.log("user:", req.user);
        
        if (!req.user) return res.status(401).json({ msg: "Not authenticated" });

        const { destination, totalPersons, TravelMonth, BudgetPerPerson, description } = req.body;

        // Validate required fields (destination, totalPersons, TravelMonth, BudgetPerPerson, description)
        if (!destination || destination.toString().trim().length === 0) {
            return res.status(400).json({ msg: "destination is required" });
        }

        if (totalPersons === undefined || totalPersons === null || isNaN(Number(totalPersons)) || Number(totalPersons) <= 0) {
            return res.status(400).json({ msg: "totalPersons is required and must be a positive number" });
        }

        if (!TravelMonth || TravelMonth.toString().trim().length === 0) {
            return res.status(400).json({ msg: "TravelMonth is required" });
        }

        if (BudgetPerPerson === undefined || BudgetPerPerson === null || isNaN(Number(BudgetPerPerson)) || Number(BudgetPerPerson) < 0) {
            return res.status(400).json({ msg: "BudgetPerPerson is required and must be a non-negative number" });
        }

        if (!description || description.toString().trim().length === 0) {
            return res.status(400).json({ msg: "description is required" });
        }

        const post = await Post.create({
            destination,
            totalPersons: Number(totalPersons),
            TravelMonth,
            BudgetPerPerson: Number(BudgetPerPerson),
            description,
            likeCount: 0,
            userId: req.user._id,
        });

        return res.status(201).json({ msg: "Post Created Successfully", post });
    } catch (err) {
        console.log("Create post error:", err);
        return res.status(500).json({ msg: "Failed to create post", error: err.message });
    }
}

async function getAllPosts(req, res) {
    try {
        const posts = await Post.find()
            .populate("userId", "name email username")
            .sort({ createdAt: -1 });

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

// (opt-in/out implementations are defined later as optInToPostById / optOutFromPostById)

// Fetch a single post by id
async function getPostById(req, res) {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ msg: "Post id is required" });

        const post = await Post.findById(id).populate("userId", "name email username");

        if (!post) return res.status(404).json({ msg: "Post not found" });

        return res.status(200).json(post);
    } catch (err) {
        console.error("getPostById error:", err);
        return res.status(500).json({ msg: "Error fetching post", error: err.message });
    }
}

// Delete a post (only owner)
async function deletePost(req, res) {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ msg: "Post id is required" });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        if (!req.user || req.user._id.toString() !== post.userId.toString()) {
            return res.status(403).json({ msg: "Not authorized to delete this post" });
        }

        await Post.deleteOne({ _id: id });
        return res.status(200).json({ msg: "Post deleted successfully" });
    } catch (err) {
        console.error("deletePost error:", err);
        return res.status(500).json({ msg: "Error deleting post", error: err.message });
    }
}

// Update a post (only owner). Updates only provided fields.
async function updatePost(req, res) {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ msg: "Post id is required" });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        if (!req.user || req.user._id.toString() !== post.userId.toString()) {
            return res.status(403).json({ msg: "Not authorized to update this post" });
        }

        // Only update provided fields
        const updatable = ["destination", "totalPersons", "TravelMonth", "BudgetPerPerson", "description"];
        updatable.forEach((field) => {
            if (req.body[field] !== undefined) {
                post[field] = req.body[field];
            }
        });

        await post.save();
        return res.status(200).json({ msg: "Post updated successfully", post });
    } catch (err) {
        console.error("updatePost error:", err);
        return res.status(500).json({ msg: "Error updating post", error: err.message });
    }
}

// Increment likeCount by 1
async function likePost(req, res) {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ msg: "Post id is required" });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ msg: "Post not found" });


        if (!req.user) return res.status(401).json({ msg: "Not authenticated" });

        // Prevent double-like from the same user
        if (post.likedBy && post.likedBy.map(String).includes(req.user._id.toString())) {
            return res.status(400).json({ msg: "User already liked this post", likeCount: post.likeCount });
        }

        // add to likedBy and increment likeCount
        post.likedBy = post.likedBy || [];
        post.likedBy.push(req.user._id);
        post.likeCount = (post.likeCount || 0) + 1;
        await post.save();

        return res.status(200).json({ msg: "Post liked", likeCount: post.likeCount, post });
    } catch (err) {
        console.error("likePost error:", err);
        return res.status(500).json({ msg: "Error liking post", error: err.message });
    }
}

// Decrement likeCount by 1, not going below zero
async function unlikePost(req, res) {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ msg: "Post id is required" });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ msg: "Post not found" });


        if (!req.user) return res.status(401).json({ msg: "Not authenticated" });

        post.likedBy = post.likedBy || [];
        const alreadyLiked = post.likedBy.map(String).includes(req.user._id.toString());
        if (!alreadyLiked) {
            return res.status(400).json({ msg: "User has not liked this post" });
        }

        // remove user from likedBy
        post.likedBy = post.likedBy.filter((u) => u.toString() !== req.user._id.toString());

        // decrement likeCount but not below zero
        post.likeCount = Math.max(0, (post.likeCount || 0) - 1);
        await post.save();

        return res.status(200).json({ msg: "Post unliked", likeCount: post.likeCount, post });
    } catch (err) {
        console.error("unlikePost error:", err);
        return res.status(500).json({ msg: "Error unliking post", error: err.message });
    }
}

// add a comment to a post
async function addComment(req, res) {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ msg: "Post id is required" });
        if (!req.user) return res.status(401).json({ msg: "Not authenticated" });

        const text = req.body && req.body.text ? req.body.text.toString().trim() : "";
        if (!text || text.length === 0) return res.status(400).json({ msg: "Comment text is required" });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        const comment = { userId: req.user._id, text, createdAt: new Date() };
        post.comments = post.comments || [];
        post.comments.push(comment);

        await post.save();

        // return updated post with populated comment authors
        const updated = await Post.findById(id).populate("comments.userId", "name email username");
        return res.status(201).json({ msg: "Comment added", post: updated });
    } catch (err) {
        console.error("addComment error:", err);
        return res.status(500).json({ msg: "Error adding comment", error: err.message });
    }
}

// get comments for a post
async function getComments(req, res) {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ msg: "Post id is required" });

        const post = await Post.findById(id).populate("comments.userId", "name email username");
        if (!post) return res.status(404).json({ msg: "Post not found" });

        return res.status(200).json({ comments: post.comments || [] });
    } catch (err) {
        console.error("getComments error:", err);
        return res.status(500).json({ msg: "Error fetching comments", error: err.message });
    }
}

// share a post: increment shareCount
async function sharePost(req, res) {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ msg: "Post id is required" });
        if (!req.user) return res.status(401).json({ msg: "Not authenticated" });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        post.shareCount = (post.shareCount || 0) + 1;
        await post.save();

        return res.status(200).json({ msg: "Post shared", shareCount: post.shareCount, post });
    } catch (err) {
        console.error("sharePost error:", err);
        return res.status(500).json({ msg: "Error sharing post", error: err.message });
    }
}

// opt in/out handlers updated to accept :id param in routes
async function optInToPostById(req, res) {
    try {
        // reuse existing logic but support param name :id
        const postId = req.params.id || req.params.postId;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        if (!post.interested_persons.map(String).includes(userId.toString())) {
            post.interested_persons.push(userId);
            await post.save();
        }

        return res.status(200).json({ msg: "Opted in successfully", post });
    } catch (err) {
        return res.status(500).json({ msg: "Error opting in", error: err.message });
    }
}

async function optOutFromPostById(req, res) {
    try {
        const postId = req.params.id || req.params.postId;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ msg: "Post not found" });

        post.interested_persons = post.interested_persons.filter(
            (id) => id.toString() !== userId.toString()
        );

        await post.save();

        return res.status(200).json({ msg: "Opted out successfully", post });
    } catch (err) {
        return res.status(500).json({ msg: "Error opting out", error: err.message });
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    deletePost,
    updatePost,
    likePost,
    unlikePost,
    optInToPost: optInToPostById,
    optOutFromPost: optOutFromPostById,
    addComment,
    getComments,
    sharePost,
};
