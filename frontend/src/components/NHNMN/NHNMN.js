import React, { useEffect } from "react";
import io from "socket.io-client";

import { hostOrigin } from "../../config.json";

import GameTop from "./GameTop";
import GameContainer from "./GameContainer";
import UserList from "./UserList";
import GameChat from "./GameChat";

function NHNMN(props) {
    const socket = io(hostOrigin);
    console.log("socket connected.");

    // close the socket when componenet unmounts
    useEffect(() => {
        return () => socket.close();
    });

    return (
        <div style={{ display: "flex", flexFlow: "column", flex: 1, height: "100%" }}>
            <GameTop socket={socket} />
            <div style={{ display: "flex", flexGrow: 1 }}>
                <UserList socket={socket} />
                <GameContainer socket={socket} />
                <GameChat socket={socket} />
            </div>
        </div>
    );
}

export default NHNMN;