const jwt = require('jsonwebtoken');
const Secret = 'jfsnjfnjinai'


function setUser (user) {
    return jwt.sign({
        _id:user._id,
        email:user.email
    },Secret)
}


function getUser (token) {
    if(!token) return null
    try {
        return jwt.verify(token,Secret)
    } catch (error) {
        return null
    }
   
}

module.exports = {setUser,getUser}