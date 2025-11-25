require("dotenv").config();
const express = require("express");
const cors = require('cors');
const { connectToMongoDb } = require('./connection');
const cookieParser = require("cookie-parser");
const { restrictToLoggedInUserOnly } = require("./middleware/auth");

const app = express();
const PORT = 8001;

const userRoute = require('./routes/user');
const postRoute = require('./routes/post');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use("/user", userRoute);
app.use("/post", restrictToLoggedInUserOnly, postRoute);

// 🔥 Use environment variable instead of hardcoded secret
connectToMongoDb(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
