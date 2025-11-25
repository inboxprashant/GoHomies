const mongoose = require("mongoose");

async function connectToMongoDb(url) {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
    }
}

module.exports = { connectToMongoDb };
