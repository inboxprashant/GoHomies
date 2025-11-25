const {getUser} = require("../Service/auth")


async function restrictToLoggedInUserOnly(req,res,next){
    const userUid = req.cookies?.uid;

    if(!userUid) return res.json({msg:"Not Logged Innnn"});

    const user = getUser(userUid);

    if(!user) return res.json({msg:"Not Logged Innnn"});

    req.user = user;

    next()

}

module.exports = {restrictToLoggedInUserOnly}