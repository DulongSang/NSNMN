import React from 'react';

function UserActionMsg(props) {
    const { name, target, action } = props.msg;
    const text = generateText(name, target, action);

    return (
        <div className="msg-user-action">
            <span>{text}</span>
        </div>
    )
}

function generateText(name, target, action) {
    if (action === "join") {
        return `A wild ${name} appeared!`;
    } else if (action === "leave") {
        return `The wild ${name} fled!`;
    } else if (action === "tickle") {
        return `${name} tickled ${target}`;
    }
}

export default UserActionMsg;