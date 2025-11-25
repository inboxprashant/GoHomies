const User = require('../models/user');
const {setUser} = require('../Service/auth')

async function handleUserSignup(req,res){
    const {name,email,username,password} = req.body;

    const user =await User.findOne({email})

    if(user){
        return res.status(200).json({msg:"User Already exists"})
    }

    await User.create({
        name,
        email,
        username,
        password
    });

    return res.status(201).json("User Created")
}

async function handleUserLogin(req,res){
    const {email,password} = req.body;

    const user = await User.findOne({
        email,password
    })

    if(!user){
        return res.status(401).json({msg:"Invalid email Or Password"});
    }
    if(user){
       const token = setUser(user)
       res.cookie('uid', token, {
        httpOnly: true,
        secure: false,   // for local dev → true only if using HTTPS
        sameSite: 'none' // VERY IMPORTANT for cross-origin cookies
    });    
        return res.status(200).json({msg:"Logged In",user:user})
    }
}

async function updateUserProfile(req,res){
    const {email,title,designation,about} = req.body;

    const updateFields = {};

    if(title) updateFields.title = title;
    if(designation) updateFields.designation = designation
    if(about) updateFields.about = about

    const user = await User.findOneAndUpdate(
        { email: email },         
        updateFields,   
        { new: true }              
    );

    return res.status(201).json({msg:"User Updated Successfully",user})

}



module.exports = {handleUserSignup,handleUserLogin,updateUserProfile}