const express = require("express");
const {handleUserSignup,handleUserLogin,updateUserProfile} = require("../controllers/user")
const User = require('../models/user');



const router = express.Router();

router.post("/",handleUserSignup);
router.post('/login',handleUserLogin);
router.post("/update",updateUserProfile);


module.exports = router;