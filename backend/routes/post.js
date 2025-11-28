const express = require("express");
const {
	createPost,
	getAllPosts,
	getPostById,
	deletePost,
	updatePost,
	likePost,
	unlikePost,
	addComment,
	getComments,
	sharePost,
	optInToPost,
	optOutFromPost,
} = require("../controllers/post");
 

const router = express.Router();

router.post('/create', createPost);
router.get('/fetch', getAllPosts);

// single post
router.get('/:id', getPostById);
router.delete('/:id', deletePost);
router.put('/:id', updatePost);

// interactions
router.post('/:id/like', likePost);
router.post('/:id/unlike', unlikePost);
router.post('/:id/optin', optInToPost);
router.post('/:id/optout', optOutFromPost);

// comments
router.post('/:id/comment', addComment);
router.get('/:id/comments', getComments);

// share
router.post('/:id/share', sharePost);

module.exports = router