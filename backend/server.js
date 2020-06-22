const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRouter = require("./routers/user");
const config = require("./config");
const app = express();


// connect to remote MongoDB
mongoose.connect(config.db.url,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log("Connected to db!") );

// Body parser middleware
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user", userRouter);

app.get("/r", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));

app.listen(config.main.PORT, () => console.log(`Server is running on port ${config.main.PORT}`));