import React from 'react';
import ava from "../images/kirino.jpg";

export default function Message(props) {
    return (
        <div className="msg">
            <img className="msg-avatar" src={ava} alt="avatar"></img>
            <div>
                <span className={`msg-username ${props.role}`}>{props.username}</span>
                <span className="msg-timestamp">{props.time}</span><br />
                <p className="msg-text">{props.text}</p>
            </div>
        </div>
    );
}
