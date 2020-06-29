const moment = require("moment");
const User = require("../model/User");
const { verifyToken } = require("./jwtUtils");

let msgId = 0;

function setEvent(io) {
    io.on("connection", socket => {
        let username, name;

        socket.on("join", async token => {
            const verification = verifyToken(token);
            if (verification.err) {
                socket.emit("auth", "Invalid token");
                return socket.disconnect();
            }
            socket.emit("auth", "success");
            username = verification.username;

            const user = await User.getUserByUsername(username);
            if (user.err) {
                return socket.emit("systemMsg", user.err);
            }
            if (user.docs === null) {
                return socket.emit("systemMsg", "username not found");
            }
            name = user.docs.name;

            io.emit("message", {
                id: msgId++,
                name: name,
                type: "userAction",
                action: "join"
            });
            console.log(`${username} connected`);
        });
        
        socket.on("message", msgText => {
            // replace < with &lt; and > with &gt;
            //msgText = msgText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

            // boardcast message
            io.emit("message", {
                id: msgId++,
                type: "text",
                name: name,
                role: "member",
                time: moment().format("MM-DD HH:mm"),
                text: msgText
            });
        });

        socket.on("disconnect", () => {
            io.emit("message", {
                id: msgId++,
                name: name,
                type: "userAction",
                action: "leave"
            });

            console.log(`${username} disconnected`);
        });
    });
}

module.exports = setEvent;