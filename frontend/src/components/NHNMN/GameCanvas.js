import React, { useEffect, useState } from "react";
import ChooseWord from "./ChooseWord";

let x, y;
let socket;

function handleMouseDown(event) {
    if (event.nativeEvent.which === 1) {
        const pos = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
        socket.emit("mouseDown", pos);
    }
}

function handleMouseMove(event) {
    if (event.nativeEvent.which === 1) {
        const pos = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
        socket.emit("mousePos", pos);
    }
}


function setSocketEventHandler(setChoices) {
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    ctx.lineCap = 'round';

    socket.on("mouseDown", pos => {
        x = pos.x;
        y = pos.y;
    });

    socket.on("mousePos", pos => {
        ctx.beginPath();

        ctx.moveTo(x, y);
        x = pos.x;
        y = pos.y;
        ctx.lineTo(pos.x, pos.y);

        ctx.stroke();
    });

    socket.on("color", color => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        // change color preview
        const colorPreview = document.getElementById("nhnmn-current-color");
        colorPreview.style.backgroundColor = color;
    });

    socket.on("size", size => {
        ctx.lineWidth = size;

        // change buttons' color
        const selectedColor = "#0dbc79";

        const size1Btn = document.getElementById("size-1");
        const size2Btn = document.getElementById("size-2");
        const size3Btn = document.getElementById("size-3");

        size1Btn.style.backgroundColor = "white";
        size2Btn.style.backgroundColor = "white";
        size3Btn.style.backgroundColor = "white";

        switch(size) {
            case 6:
                size1Btn.style.backgroundColor = selectedColor;
                break;
            
            case 15:
                size2Btn.style.backgroundColor = selectedColor;
                break;
            
            case 30:
                size3Btn.style.backgroundColor = selectedColor;
                break;
            
            default:
                break;
        }
    });

    socket.on("clear", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.on("fill", () => {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // change mode
    socket.on("mode", mode => {
        const selectedColor = "#0dbc79";

        // reset buttons' bg color
        const brushBtn = document.getElementById("brush");
        const eraserBtn = document.getElementById("eraser");

        brushBtn.style.backgroundColor = "white";
        eraserBtn.style.backgroundColor = "white";

        switch(mode) {
            case "brush":
                // draws new shapes on top of the existing canvas content
                ctx.globalCompositeOperation = "source-over";

                // change color
                brushBtn.style.backgroundColor = selectedColor;
                break;
            
            case "eraser":
                // erase the brush area
                ctx.globalCompositeOperation = "destination-out";

                // change color
                eraserBtn.style.backgroundColor = selectedColor;
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