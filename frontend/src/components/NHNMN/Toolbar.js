import React from "react";
import { Trash } from "react-bootstrap-icons";

import brushIcon from "../../images/brush-icon.png";
import eraserIcon from "../../images/eraser-icon.png";
import fillIcon from "../../images/fill-icon.png";

function makeHandleSizeChange(socket, size) {
  return () => {
    socket.emit("size", size);
  };
}

function Toolbar(props) {

  const colorList1 = ["white", "black", "red", "orange", "yellow", "LawnGreen"];
  const colorList2 = ["cyan", "blue", "BlueViolet", "LightPink", "grey", "SandyBrown"];

  const handleColorChange = event => {
    const color = event.target.style.backgroundColor;
    props.socket.emit("color", color);

    // change color preview
    const colorPreview = document.getElementById("nhnmn-current-color");
    colorPreview.style.backgroundColor = color;
  };

  function handleModeChange(mode) {
    return () => {
      props.socket.emit("mode", mode);
    }
  };

  const handleClear = () => {
    props.socket.emit("clear");
  }

  const handleFill = () => {
    props.socket.emit("fill");
  }

  return (
    <div className="nhnmn-toolbar noselect">
      <div id="nhnmn-current-color" title="color preview" style={{backgroundColor: "black"}}/>
      <div id="nhnmn-colors">
        <div style={{ display: "flex" }}>
          {colorList1.map(color => 
            <div key={color} style={{ backgroundColor: color }} onClick={handleColorChange}/>
          )}
        </div>
        <div style={{ display: "flex" }}>
          {colorList2.map(color => 
            <div key={color} style={{ backgroundColor: color }} onClick={handleColorChange} />
          )}
        </div>
      </div>
      <div className="nhnmn-btn" id="brush" 
        style={{ marginLeft: "30px" }} onClick={handleModeChange("brush")}>
        <img src={brushIcon} alt="brush" />
      </div>
      <div className="nhnmn-btn" id="eraser" onClick={handleModeChange("eraser")}>
        <img src={eraserIcon} alt="eraser" />
      </div>
      <div className="nhnmn-btn" id="fill" onClick={handleFill}>
        <img src={fillIcon} alt="fill" />
      </div>
      <div className="nhnmn-btn" id="size-1" 
        style={{ marginLeft: "30px" }} onClick={makeHandleSizeChange(props.socket, 6)}>
        <div></div>
      </div>
      <div className="nhnmn-btn" id="size-2" onClick={makeHandleSizeChange(props.socket, 15)}>
        <div></div>
      </div>
      <div className="nhnmn-btn" id="size-3" onClick={makeHandleSizeChange(props.socket, 30)}>
        <div></div>
      </div>
      <div className="nhnmn-btn" id="clear" 
        style={{ marginLeft: "30px" }} onClick={handleClear}>
        <Trash style={{ fontSize: "42px", padding: "3px" }} />
      </div>
    </div>
  )
}

export default Toolbar;