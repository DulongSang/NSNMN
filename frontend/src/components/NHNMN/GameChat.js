import React, { useState, useEffect } from "react";

function GameChat(props) {
    const [msgs, setMsgs] = useState([]);

    // set socket event handler
    useEffect(() => {
        console.log('socket');
        props.socket.on("gameMsg", msg => {
            setMsgs(prevMsgs => [...prevMsgs, msg]);
        });
    }, [props.socket]);

    return (
        <div style={{ flex: 3, display: "flex", flexFlow: "column" }}>
            <ul className="game-msg-container" 
                style={{ marginTop: "10px", flex: 1, paddingLeft: "10px" }}>
                {msgs.map(msg => {
                    switch(msg.type) {
                        case 0:     // user message
                            return <Message name={msg.name} text={msg.text} key={msg.id} />;
                        case 1:     // user correct guess
                            return (
                                <div style={{ color: "green" }} key={msg.id}>
                                    {msg.name} guessed the word!
                                </div>);
                        case 2:     // user is drawing now
                            return (
                                <div style={{ color: "blue" }} key={msg.id}>
                                    {msg.name} is drawing now.
                                </div>);
                        default:
                            return (
                                <div style={{ color: "red" }} key={msg.id}>
                                    Invalid message type {msg.type}
                                </div>);
                    }
                })}
            </ul>
            <InputArea socket={props.socket} />
        </div>
    );
}


function Message(props) {
    return (
        <div>
            <span style={{ color: "blue" }}>{props.name}: </span>
            <span>{props.text}</span>
        </div>
    );
}


function InputArea(props) {
    const [text, setText] = useState("");

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            props.socket.emit("gameMsg", text);
            setText("");
        }
    };

    return (<input onKeyDown={handleKeyDown} value={text} onChange={handleChange}
        placeholder={"Press [enter] to send"} 
        style={{ padding: "6px", width: "400px", flex: 1, flexGrow: 0 }} />
    );
}

export default GameChat;