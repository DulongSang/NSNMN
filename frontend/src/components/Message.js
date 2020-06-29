import React from 'react';
import config from "../config.json";

function Message(props) {
  const { name, role, time, text, avatar } = props.msg;
  return (
    <div className="msg">
      <img className="msg-avatar" src={config.hostOrigin + "/src/avatars/" + avatar} alt="avatar" />
      <div>
        <span className={`msg-username ${role}`}>{name}</span>
        <span className="msg-timestamp">{time}</span><br />
        <p className="msg-text">{text}</p>
      </div>
    </div>
    );
}

export default Message;