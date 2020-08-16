const moment = require("moment");
const User = require("../model/User");
const { verifyToken } = require("./jwtUtils");
const config = require("../config.json");

let msgId = 0;

function setEvent(io) {
    io.on("connection", socket => {
        let username, name, avatar;

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
            avatar = user.docs.avatar;

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
                avatar: `${config.main.url}/src/avatars/${avatar}`,
                time: moment().format("MM-DD HH:mm"),
                text: msgText
            });
        });

        socket.on("tickle", targetName => {
            io.emit("message", {
                id: msgId++,
                name: name,
                target: targetName,
                type: "userAction",
                action: "tickle"
            });
        });

        NHNMN_handler(io, socket);

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


function NHNMN_handler(io, socket) {
    socket.on("mouseDown", pos => {
        io.emit("mouseDown", pos);
    });

    socket.on("mousePos", pos => {
        io.emit("mousePos", pos);
    });

    socket.on("color", color => {
        io.emit("color", color);
    });

    socket.on("size", size => {
        io.emit("size", size);
    });

    socket.on("clear", () => {
        io.emit("clear");
    });

    socket.on("mode", mode => {
        io.emit("mode", mode);
    });

    socket.on("fill", () => {
        io.emit("fill");
    });
}

module.exports = setEvent;