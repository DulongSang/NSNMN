import React, { Component } from 'react';
import io from "socket.io-client";

import Message from "./Message";
import InputArea from "./InputArea";

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
        this.socket.emit("join", "Hello");

        this.socket.on("message", msg => {
            this.setState(prevState => {
                const msgs = prevState.msgs;
                msgs.push(msg);

                return { msgs };
            });
        });
    }
    
    render() {
        return (
            <div>
                <div style={{height: "75vh"}}>
                    <ul className="chat">
                        {this.state.msgs.map(msg => (
                            <li key={msg.id}>
                                <Message role={msg.role} username={msg.username}
                                    time={msg.time} text={msg.text} />
                            </li>)
                        )}
                    </ul>
                </div>
                <InputArea socket={this.socket}/>
            </div>
        );
    }
}
