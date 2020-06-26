const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");

const userRouter = require("./routers/user");
const config = require("./config");
const setEvent = require("./sockethandler");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);


// all access from any domain [temp]
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}

app.use(cors(corsOptions));


// set io event
setEvent(io);

// connect to remote MongoDB
mongoose.connect(config.db.url,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log("Connected to db!") );

// Body parser middleware
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user", userRouter);

app.get("/r", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));

server.listen(config.main.PORT, () => console.log(`Server is running on port ${config.main.PORT}`));