const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");

const userRouter = require("./routers/user");
const uploadRouter = require("./routers/upload");
const config = require("./config");
const setEvent = require("./utils/sockethandler");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

// set io event
setEvent(io);


// all access from any domain [temp]
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    return callback(null, true)

  }
}

app.use(cors(corsOptions));

// connect to remote MongoDB
mongoose.connect(config.db.url,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log("\x1b[32mConnected to db!\x1b[0m") );

// Body parser middleware
app.use(bodyParser.json());

app.use("/src", express.static(path.join(__dirname, "public")));

app.use("/api/user", userRouter);
app.use("/api/upload", uploadRouter);

server.listen(config.main.PORT, () => console.log(`Server running on port \x1b[36m${config.main.PORT}\x1b[0m`));