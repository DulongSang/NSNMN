import React from "react";

import { Brush, Check2Circle } from "react-bootstrap-icons";

function UserItem(props) {
    const { avatar, name, point, status } = props.user;

    return (
        <li className="game-user-item">
            <div className="flex">
                <img src={avatar} alt="avatar" style={{ flex: 1 }} />
                <div style={{ flex: 2 }} >
                    <span className="game-user-name">{name}</span><br />
                    <span className="game-user-point">Point: {point}</span>
                </div>
                <div style={{ flex: 1 }} >
                    {renderStatusIcon(status)}
                </div>
            </div>
        </li>
    );
}


function renderStatusIcon(status) {
    switch(status) {
        case 1:
            return <Check2Circle style={{ fontSize: "40px", color: "#056d3b", margin: "10px" }} />;
        case 2:
            return <Brush style={{ fontSize: "40px", color: "black", margin: "10px" }} />;
        default:
            return <div style={{ display: "inline-block", width: "60px" }}/>;   // need to be fixed!
    }
}

export default UserItem;