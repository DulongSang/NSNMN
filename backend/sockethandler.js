function setEvent(io) {
    io.on("connection", socket => {
        // test
        console.log("Welcome!");
        io.emit("message", {role: "manager", username: "MasterTime", time: "06-26 3:50", text: "Hello World!"});
    });
}

module.exports = setEvent;