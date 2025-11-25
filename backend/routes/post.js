const express = require("express");
const {CreateNewPost,getAllPost, optInToPost,optOutFromPost} = require("../controllers/post")
 

const router = express.Router();

router.post('/create',CreateNewPost)
router.get('/fetch',getAllPost)
router.get('/optin/:postId', optInToPost);
router.get('/optout/:postId', optOutFromPost);

module.exports = router