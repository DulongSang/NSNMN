const moment = require("moment");

let msgId = 0;

function setEvent(io) {
    io.on("connection", socket => {
        // test
        console.log(`Welcome ${socket.id}`);
        
        socket.on("message", msgText => {
            io.emit("message", {
                id: msgId++,
                role: "a",
                username: "MasterTime",
                time: moment().format("MM-DD HH:mm"),
                text: msgText
            });
        });

        socket.on("disconnect", () => {
            console.log(`${socket.id} disconnected`);
        });
    });
}

module.exports = setEvent;