const { getUser } = require("../Service/auth");
const User = require("../models/user");

async function restrictToLoggedInUserOnly(req, res, next) {
    try {
        const token = req.cookies?.uid;
        if (!token) {
            return res.status(401).json({ msg: "Not logged in" });
        }

        const decoded = getUser(token);
        if (!decoded) {
            return res.status(401).json({ msg: "Invalid token" });
        }

        // IMPORTANT: Fetch real MongoDB user
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ msg: "User no longer exists" });
        }

        req.user = user;   // <-- NOW this is a REAL Mongoose user document
        next();
    } catch (err) {
        console.log("Auth error:", err);
        return res.status(500).json({ msg: "Auth middleware error" });
    }
}

module.exports = { restrictToLoggedInUserOnly };
