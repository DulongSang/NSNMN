const moment = require("moment");
const User = require("../model/User");
const { verifyToken } = require("./jwtUtils");
const config = require("../config.json");
const { generateHint, replaceAt } = require("./stringManipulations");
const { words } = require("../nhnmn/words.json");

let msgId = 0;
let chatUserList = [];


const nhnmnSession = {
    word: null,
    hint: null,
    users: [],
    painter: 0,
    time: 90,
    round: 0,
    n_rounds: 3,
    roundTimerId: 0
};


function GameUser(username, name, avatar, id) {
    this.username = username;
    this.name = name;
    this.avatar = avatar;
    this.id = id;
    this.point = 0;

    /**
     * status:
     * 0: not guessed yet
     * 1: user guessed
     * 2: user is drawing
     */
    this.status = 0;
}

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

            socket.join("chat");
            io.to("chat").emit("message", {
                id: msgId++,
                name: name,
                type: "userAction",
                action: "join"
            });
            
            chatUserList.push({ name, avatar });
            io.to("chat").emit("userList", chatUserList);

            socket.on("message", msgText => {
                // replace < with &lt; and > with &gt;
                //msgText = msgText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
                // boardcast message
                io.to("chat").emit("message", {
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
                io.to("chat").emit("message", {
                    id: msgId++,
                    name: name,
                    target: targetName,
                    type: "userAction",
                    action: "tickle"
                });
            });

            socket.on("disconnect", () => {
                // remove socket from chatUserList
                chatUserList = chatUserList.filter(user => user.name !== name);
                io.to("chat").emit("userList", chatUserList);
                io.to("chat").emit("message", {
                    id: msgId++,
                    name: name,
                    type: "userAction",
                    action: "leave"
                });
            });
        });
        

        // nhnmn socket event handlers
        socket.on("game-join", async token => {
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
            avatar = `${config.main.url}/src/avatars/${user.docs.avatar}`;
    
            socket.join("nhnmn");
            nhnmnSession.users.push(new GameUser(username, name, avatar, socket.id));
            io.to("nhnmn").emit("userList", nhnmnSession.users);
    
    
            // set socket event handlers
            socket.on("mouseDown", pos => {
                io.to("nhnmn").emit("mouseDown", pos);
            });
        
            socket.on("mousePos", pos => {
                io.to("nhnmn").emit("mousePos", pos);
            });
        
            socket.on("color", color => {
                io.to("nhnmn").emit("color", color);
            });
        
            socket.on("size", size => {
                io.to("nhnmn").emit("size", size);
            });
        
            socket.on("clear", () => {
                io.to("nhnmn").emit("clear");
            });
        
            socket.on("mode", mode => {
                io.to("nhnmn").emit("mode", mode);
            });
        
            socket.on("fill", () => {
                io.emit("fill");
            });
        
            // when user chooces a word to draw
            socket.on("wordChose", word => {
                nhnmnSession.word = word;
                nhnmnSession.hint = generateHint(word);

                io.to("nhnmn").emit("time", nhnmnSession.time);   // reset all users' timer
                socket.broadcast.to("nhnmn").emit("hint", nhnmnSession.hint);
                socket.emit("hint", word);
                io.to("nhnmn").emit("clear");

                const msg = {
                    name,
                    type: 2,
                    id: msgId++
                };
                io.to("nhnmn").emit("gameMsg", msg)

                clearInterval(nhnmnSession.roundTimerId);
                nhnmnSession.roundTimerId = setInterval(() => {
                    nhnmn_nextRound(io);
                }, nhnmnSession.time * 1000);
            });
        
            socket.on("gameMsg", text => {
                if(text === "/start") {
                    // start a new game
                    nhnmnSession.painter = 0;
                    nhnmnSession.round = 1;

                    io.to("nhnmn").emit("mode", "brush");
                    io.to("nhnmn").emit("color", "#000");
                    io.to("nhnmn").emit("size", 6);
                    io.to("nhnmn").emit("round", nhnmnSession.round);
                    io.to("nhnmn").emit("totalRounds", nhnmnSession.n_rounds);
                    nhnmn_nextRound(io);
                    return;
                } else if (text === "/next") {
                    nhnmn_nextRound(io);
                    return;
                }

                        
                /** msg type:
                 * 0: user regular message
                 * 1: user guessed the word (green)
                 * 2: user is drawing now (blue)
                 */
                
                // check if the answer is correct
                if (text === nhnmnSession.word) {
                    const status = nhnmnSession.users
                        .find(user => user.username === username).status;
                    if (status !== 0) { // if this user has already guessed
                        return;
                    }

                    const msg = {
                        name,
                        type: 1,
                        id: msgId++
                    };
                    io.to("nhnmn").emit("gameMsg", msg);

                    // update user info
                    nhnmnSession.users.forEach(user => {
                        if (user.username === username) {
                            user.status = 1;
                            user.point += 100;
                        }
                    });
                    io.to("nhnmn").emit("userList", nhnmnSession.users);

                    if (nhnmn_isRoundOver()) {
                        nhnmn_nextRound(io);
                    }

                } else {
                    const msg = {
                        name,
                        text: text,
                        type: 0,
                        id: msgId++
                    };
                    io.to("nhnmn").emit("gameMsg", msg);
                }
                
            });
    
            socket.on("disconnect", () => {
                // remove socket from user list
                nhnmnSession.users = nhnmnSession.users.filter(user => user.name !== name);
                io.to("nhnmn").emit("userList", nhnmnSession.users);
            })
        });
    });
}

function nhnmn_nextRound(io) {
    // stop all users' timer
    io.to("nhnmn").emit("time", -1);

    // reset all users' status
    nhnmnSession.users.forEach(user => user.status = 0);

    // set painter
    nhnmnSession.painter += 1;
    if (nhnmnSession.painter === nhnmnSession.users.length) {
        nhnmnSession.painter = 0;
        nhnmnSession.round += 1;
    }
    nhnmnSession.users[nhnmnSession.painter].status = 2;

    // choose 3 words
    let index1, index2, index3;
    index1 = Math.floor(Math.random() * words.length);
    do {
        index2 = Math.floor(Math.random() * words.length);
    } while(index2 === index1);
    do {
        index3 = Math.floor(Math.random() * words.length);
    } while (index3 === index1 || index3 === index2);

    const choices = [words[index1], words[index2], words[index3]];
    io.to(nhnmnSession.users[nhnmnSession.painter].id).emit("choices", choices);
    io.to("nhnmn").emit("userList", nhnmnSession.users);
}

function nhnmn_isRoundOver() {
    for (let i = 0; i < nhnmnSession.users.length; i++) {
        if (nhnmnSession.users[i].status === 0) {
            return false;
        }
    }
    return true;
}

module.exports = setEvent;