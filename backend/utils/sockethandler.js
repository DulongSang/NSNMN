const moment = require("moment");
const User = require("../model/User");
const { verifyToken } = require("./jwtUtils");
const config = require("../config.json");
const { generateHint, strReplaceAt } = require("./stringManipulations");
const { words } = require("../nhnmn/words.json");

let msgId = 0;
let chatUserList = [];


const nhnmnSession = {
    word: null,
    hint: null,
    users: [],
    painterIndex: 0,
    painterUsername: null,
    time: 90,
    round: 0,
    n_rounds: 3,
    roundTimerId: -1,
    hintTimerId: -1
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

            // op: { type, payload }
            socket.on("nhnmn-op", op => {
                if (username === nhnmnSession.painterUsername) {
                    io.to("nhnmn").emit("nhnmn-op", op);
                }
            });
        
            // when user chooces a word to draw
            socket.on("wordChose", word => {
                nhnmnSession.word = word;
                nhnmnSession.hint = generateHint(word);
                nhnmn_roundStart(io);
            });
        
            socket.on("gameMsg", text => {
                /** msg type:
                 * 0: user regular message
                 * 1: user guessed the word (green)
                 * 2: user is drawing now (blue)
                 * 3: system message
                 */

                if (text[0] === "/") {
                    switch(text.substr(1)) {
                        case "start":
                            nhnmn_newGame(io);
                            return;
                        case "next":
                            nhnmn_nextRound(io);
                            return;
                        case "end":
                            nhnmn_clearTimers();
                            return;
                        default:
                            const msg = {
                                text: `${text} is not a valid command!`,
                                type: 3,
                                id: msgId++
                            };
                            socket.emit("gameMsg", msg);
                            return;
                    }
                }
                
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

function nhnmn_newGame(io) {
    nhnmnSession.painterIndex = -1; // in nhnmn_nextRound, painterIndex += 1
    nhnmnSession.round = 1;

    io.to("nhnmn").emit("round", nhnmnSession.round);
    io.to("nhnmn").emit("totalRounds", nhnmnSession.n_rounds);
    nhnmn_nextRound(io);
}


function nhnmn_nextRound(io) {
    // stop all users' timer
    io.to("nhnmn").emit("time", -1);

    // reset painter's tool
    io.to("nhnmn").emit("nhnmn-op", { type: "mode", payload: { mode: "brush" }});
    io.to("nhnmn").emit("nhnmn-op", { type: "color", payload: { color: "#000" }});
    io.to("nhnmn").emit("nhnmn-op", { type: "size", payload: { size: 6 }});

    // clear hint emit interval
    clearInterval(nhnmnSession.hintTimerId);

    // reset all users' status
    nhnmnSession.users.forEach(user => user.status = 0);

    // set painterIndex
    nhnmnSession.painterIndex += 1;
    if (nhnmnSession.painterIndex === nhnmnSession.users.length) {
        nhnmnSession.painterIndex = 0;
        nhnmnSession.round += 1;
        io.to("nhnmn").emit("round", nhnmnSession.round);
    }
    nhnmnSession.users[nhnmnSession.painterIndex].status = 2;
    nhnmnSession.painterUsername = nhnmnSession.users[nhnmnSession.painterIndex].username;

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
    io.to(nhnmnSession.users[nhnmnSession.painterIndex].id).emit("choices", choices);
    io.to("nhnmn").emit("userList", nhnmnSession.users);
}

function nhnmn_roundStart(io) {
    io.to("nhnmn").emit("time", nhnmnSession.time);   // reset all users' timer
    io.to("nhnmn").emit("nhnmn-op", { type: "clear" }); // clear canvas

    io.to("nhnmn").emit("hint", nhnmnSession.hint);
    io.to(nhnmnSession.users[nhnmnSession.painterIndex].id).emit("hint", nhnmnSession.word);

    const msg = {
        name: nhnmnSession.users[nhnmnSession.painterIndex].name,
        type: 2,
        id: msgId++
    };
    io.to("nhnmn").emit("gameMsg", msg);
    
    // set round timer
    clearTimeout(nhnmnSession.roundTimerId);
    nhnmnSession.roundTimerId = setTimeout(() => {
        io.to("nhnmn").emit("hint", nhnmnSession.word);
        nhnmn_nextRound(io);
    }, nhnmnSession.time * 1000);

    // set hint emit timer
    nhnmnSession.hintTimerId = setInterval(() => nhnmn_hint(io), 30000);
}

function nhnmn_isRoundOver() {
    for (let i = 0; i < nhnmnSession.users.length; i++) {
        if (nhnmnSession.users[i].status === 0) {
            return false;
        }
    }
    return true;
}

function nhnmn_hint(io) {
    let index;
    let limitGuard = 0;
    do {
        index = Math.floor(Math.random() * nhnmnSession.word.length);
        limitGuard++;
    } while　(nhnmnSession.hint[index] !== "_" && limitGuard < 100);
    nhnmnSession.hint = strReplaceAt(nhnmnSession.hint, nhnmnSession.word[index], index);
    io.to("nhnmn").emit("hint", nhnmnSession.hint);
    io.to(nhnmnSession.users[nhnmnSession.painterIndex].id).emit("hint", nhnmnSession.word);
}

function nhnmn_clearTimers() {
    clearTimeout(nhnmnSession.roundTimerId);
    clearInterval(nhnmnSession.hintTimerId);
}

module.exports = setEvent;