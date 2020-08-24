import React, { useEffect, useState } from "react";
import ChooseWord from "./ChooseWord";

let x, y;
let socket;

function handleMouseDown(event) {
    if (event.nativeEvent.which === 1) {
        const pos = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
        socket.emit("nhnmn-op", { type: "mouseDown", payload: { pos } });
    }
}

function handleMouseMove(event) {
    if (event.nativeEvent.which === 1) {
        const pos = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
        socket.emit("nhnmn-op", { type: "mousePos", payload: { pos } });
    }
}


function setSocketEventHandler(setChoices) {
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";

    // buttons' active color and inactive color
    const activeColor = "#0dbc79";
    const inactiveColor = "#fff";

    // set socket event handler
    socket.on("nhnmn-op", op => {
        switch(op.type) {
            case "mouseDown":
                x = op.payload.pos.x;
                y = op.payload.pos.y;
                break;
            
            case "mousePos":
                ctx.beginPath();
                ctx.moveTo(x, y);
                x = op.payload.pos.x;
                y = op.payload.pos.y;
                ctx.lineTo(x, y);
                ctx.stroke();
                break;

            case "color":
                const color = op.payload.color;

                // change brush and fill color
                ctx.strokeStyle = color;
                ctx.fillStyle = color;

                // change color preview
                const colorPreview = document.getElementById("nhnmn-current-color");
                colorPreview.style.backgroundColor = color;
                break;

            case "size":
                const size = op.payload.size;
                ctx.lineWidth = size;

                // change buttons' color
                const size1Btn = document.getElementById("size-1");
                const size2Btn = document.getElementById("size-2");
                const size3Btn = document.getElementById("size-3");

                size1Btn.style.backgroundColor = inactiveColor;
                size2Btn.style.backgroundColor = inactiveColor;
                size3Btn.style.backgroundColor = inactiveColor;

                switch(size) {
                    case 6:
                        size1Btn.style.backgroundColor = activeColor;
                        break;
                    
                    case 15:
                        size2Btn.style.backgroundColor = activeColor;
                        break;
                    
                    case 30:
                        size3Btn.style.backgroundColor = activeColor;
                        break;
                    
                    default:
                        break;
                }
                break;
            
            case "clear":
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                break;
            
            case "fill":
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                break;
            
            case "mode":
                const brushBtn = document.getElementById("brush");
                const eraserBtn = document.getElementById("eraser");

                // reset buttons' bg color
                brushBtn.style.backgroundColor = inactiveColor;
                eraserBtn.style.backgroundColor = inactiveColor;

                switch(op.payload.mode) {
                    case "brush":
                        // draws new shapes on top of the existing canvas content
                        ctx.globalCompositeOperation = "source-over";

                        // change color
                        brushBtn.style.backgroundColor = activeColor;
                        break;
                    
                    case "eraser":
                        // erase the brush area
                        ctx.globalCompositeOperation = "destination-out";

                        // change color
                        eraserBtn.style.backgroundColor = activeColor;
                        break;
        
                    default:
                        break;
                }
                break;
            
            default:
                break;
        }
    });

    socket.on("choices", choices => setChoices(choices));
}

function GameCanvas(props) {
    const [choices, setChoices] = useState(null);

    useEffect(() => {
        socket = props.socket;
        setSocketEventHandler(setChoices);
    }, [props.socket]);

    const chooseWord = (word) => {
        socket.emit("wordChose", word);
        setChoices(null);
    };

    const style = {
        border: "1px solid #808080",
        zIndex: 1
    };

    const width = "820px";
    const height = "500px";

    return (
        <div style={{ position: "relative" }}>
            <canvas id="game-canvas" width={width} height={height} style={style}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown} />
            {choices && // if choices != null, render ChooseWord
                <ChooseWord height={height} width={width} choices={choices} chooseWord={chooseWord} />
            }
        </div>
    );
}

export default GameCanvas;