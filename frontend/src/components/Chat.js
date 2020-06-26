import React, { Component } from 'react';
import io from "socket.io-client";

import Message from "./Message";

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = { msgs: [] }; 
        this.socket = null;
    }

    componentDidMount() {
        this.socket = io();

        // emit join message to server
        this.socket.emit("join", "Hello");

        this.socket.on("message", msg => {
            this.setState(prevState => {msgs: prevState.msgs.push(msg)});
        });
    }
    
    render() {
        return (
            <div>
                <ul>
                    {this.state.msgs.map(msg => `<li><Message 
                        role=${msg.role} username=${msg.username} 
                        time=${msg.time} text=${msg.text} />`)}
                </ul>
            </div>
        );
    }
}
