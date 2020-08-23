import React, { useState, useEffect } from "react";

let timerId = 0;

function GameTop(props) {
    const [time, setTime] = useState(0);
    const [round, setRound] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [hint, setHint] = useState(null);

    // only run when the component first renders
    // setup socket event handlers
    useEffect(() => {
        props.socket.on("time", t => {
            if (t === -1) {
                clearInterval(timerId);
                return;
            }

            setTime(t);
            clearInterval(timerId);
            timerId = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        });
        props.socket.on("round", round => setRound(round));
        props.socket.on("totalRounds", totalRounds => setTotalRounds(totalRounds));
        props.socket.on("hint", hint => setHint(hint));
    }, [props.socket]);

    return (
        <div className="game-top">
            <div className="circle"><div>{time}</div></div>
            <span className="nhnmn-round-text">Round {round} of {totalRounds}</span>
            <div className="nhnmn-hint">{hint}</div>
        </div>
    );
}

export default GameTop;