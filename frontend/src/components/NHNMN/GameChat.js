import React, { useState, useEffect } from "react";

function GameChat(props) {
    const [msgs, setMsgs] = useState([]);

    // set socket event handler
    useEffect(() => {
        props.socket.on("gameMsg", msg => {
            setMsgs(prevMsgs => [...prevMsgs, msg]);

            // scroll to bottom
            // To be optimized
            const container = document.getElementById("game-msg-container");
            container.scrollTop = container.scrollHeight;
        });
    }, [props.socket]);

    const ulStyle = { 
        padding: "5px 0 0 10px", 
        flexGrow: 1,
        overflowY: "scroll", 
        maxHeight: "500px" 
    };

    return (
        <div style={{ flex: 3, display: "flex", flexFlow: "column" }}>
            <ul style={ulStyle} id="game-msg-container">
                {msgs.map(msg => {
                    let content;
                    switch(msg.type) {
                        case 0:     // user message
                            content = <Message name={msg.name} text={msg.text} />;
                            break;
                        case 1:     // user correct guess
                            content = (<div style={{ color: "green" }}>
                                {msg.name} guessed the word!</div>);
                            break;
                        case 2:     // user is drawing now
                            content = (<div style={{ color: "blue" }}>
                                {msg.name} is drawing now.</div>);
                            break;
                        case 3:     // system warning
                            content = (<div style={{ color: "red" }}>
                                {msg.text}</div>);
                            break;
                        default:
                            content = (<div style={{ color: "red" }}>
                                Invalid message type {msg.type}</div>);
                    }
                    return <li key={msg.id}>{content}</li>;
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
            if (text.length !== 0) {
                props.socket.emit("gameMsg", text);
                setText("");
            }
        }
    };

    return (<input onKeyDown={handleKeyDown} value={text} onChange={handleChange}
        placeholder={"Press [enter] to send"} 
        style={{ padding: "6px", width: "400px", flex: 1, flexGrow: 0 }} />
    );
}

export default GameChat;