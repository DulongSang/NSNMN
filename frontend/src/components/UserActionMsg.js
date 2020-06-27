import React from 'react';

function UserActionMsg(props) {
    const { name, action } = props.msg;
    const text = generateText(name, action);

    return (
        <div className="msg-user-action">
                <span>{text}</span>
            </div>
    )
}

function generateText(name, action) {
    if (action === "join") {
        return `A wild ${name} appeared!`;
    } else if (action === "leave") {
        return `The wild ${name} fled!`;
    }
}

export default UserActionMsg;