import React from "react";

import GameCanvas from "./GameCanvas";
import Toolbar from "./Toolbar";

function GameContainer(props) {
    return (
        <div style={{ flex: 6 }}>
            <GameCanvas socket={props.socket} />
            <Toolbar socket={props.socket} />
        </div>
    );
}

export default GameContainer;