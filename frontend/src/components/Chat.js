import React, { Component } from 'react';
import io from "socket.io-client";

import Message from "./Message";
import InputArea from "./InputArea";
import UserActionMsg from "./UserActionMsg";
import config from "../config.json";

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = { msgs: [] }; 
        this.socket = null;
    }

    componentDidMount() {
        this.socket = io(config.hostOrigin);

        // emit join message to server
        const token = localStorage.getItem("token");
        if (token === null) {
            // !TODO: handle when token is null
        }

        this.socket.emit("join", token);

        this.socket.on("message", msg => {
            this.setState(prevState => ({ msgs: [...prevState.msgs, msg] }));
            this.scrollToBottom();  // auto scroll to bottom
        });

        this.socket.on("auth", msg => {
            if(msg !== "success") {
                // !TODO: handle token validation error
            }
        });
    }

    scrollToBottom = () => {
        // To be optimized
        const chatMessages = document.getElementById("messages");
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    render() {
        return (
            <div>
                <div style={{height: "75vh", overflow: "auto"}} id="messages">
                    <ul className="chat">
                        {this.state.msgs.map(msg => {
                            let msgComponent;
                            if (msg.type === "text") {
                                msgComponent = <Message msg={msg}/>;
                            } else if (msg.type === "userAction") {
                                msgComponent = <UserActionMsg msg={msg} />;
                            }
                            return <li key={msg.id}>{msgComponent}</li>;
                        })}
                    </ul>
                </div>
                <InputArea socket={this.socket}/>
            </div>
        );
    }
}
