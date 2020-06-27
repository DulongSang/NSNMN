import React from 'react';
import ava from "../images/kirino.jpg";

export default function Message(props) {
  const {name, role, time, text} = props.msg;
  return (
    <div className="msg">
      <img className="msg-avatar" src={ava} alt="avatar"></img>
      <div>
        <span className={`msg-username ${role}`}>{name}</span>
        <span className="msg-timestamp">{time}</span><br />
        <p className="msg-text">{text}</p>
      </div>
    </div>
    );
}
