import React, { Component } from 'react';
import io from "socket.io-client";

import Message from "./Message";
import InputArea from "./InputArea";
import UserActionMsg from "./UserActionMsg";

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = { msgs: [] }; 
        this.socket = null;
    }

    componentDidMount() {
        const url = "localhost:5000";
        this.socket = io(url);

        // emit join message to server
        const username = "mastertime";  // to be replaced
        this.socket.emit("join", username);

        this.socket.on("message", msg => {
            this.setState(prevState => ({ msgs: [...prevState.msgs, msg] }));
            this.scrollToBottom();  // auto scroll to bottom
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
