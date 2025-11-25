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

connectToMongoDb('mongodb+srv://Superman:Prashant%40123@cluster0.u53jmy6.mongodb.net/Gohomies?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
