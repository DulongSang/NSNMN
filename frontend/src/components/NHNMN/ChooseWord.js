import React from 'react';

function ChooseWord(props) {
    const style = { height: props.height, width: props.width };

    const handleOnClick = choice => () => {
        props.chooseWord(choice);
    };

    return (
        <div id="over-canvas" style={style}>
            <div className="choice-container">
                {props.choices.map(choice => 
                    <div key={choice} onClick={handleOnClick(choice)}>{choice}</div>)}
            </div>
        </div>
    );
}

export default ChooseWord;