import React from 'react';

function Message(props) {
  const { name, role, time, text, avatar } = props.msg;

  const tickle = () => {
    props.socket.emit("tickle", name);
  };

  return (
    <div className="msg">
      <img className="msg-avatar" src={avatar} alt="avatar" onDoubleClick={tickle} />
      <div>
        <span className={`msg-username ${role}`}>{name}</span>
        <span className="msg-timestamp">{time}</span><br />
        <p className="msg-text">{text}</p>
      </div>
    </div>
    );
}

export default Message;