const jwt = require("jsonwebtoken");

const SECRET = "SUPER_SECRET_KEY_123"; // ← Replace with env variable later

function setUser(user) {
    return jwt.sign(
        { _id: user._id, email: user.email, name: user.name },
        SECRET,
        { expiresIn: "3d" }
    );
}

function getUser(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
}

module.exports = { setUser, getUser };
