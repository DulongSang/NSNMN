import React, { useState, useEffect } from "react";

function GameTop(props) {
    const [time, setTime] = useState(125);
    const [round, setRound] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);

    if (time > 0) {
        setTimeout(() => setTime(time - 1), 1000);
    }

    // only run when the component first renders
    // setup socket event handlers
    useEffect(() => {
        props.socket.on("time", time => setTime(time));
        props.socket.on("round", round => setRound(round));
        props.socket.on("totalRounds", totalRounds => setTotalRounds(totalRounds));
    }, [props.socket]);

    return (
        <div className="game-top">
            <div className="circle"><div>{time}</div></div>
            <span className="nhnmn-round-text">Round {round} of {totalRounds}</span>
            <div className="nhnmn-hint">{props.hint}</div>
        </div>
    );
}

export default GameTop;