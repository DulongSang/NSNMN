import React, { Component } from 'react';
import PropTypes from "prop-types";

class InputArea extends Component {
    constructor(props) {
        super(props);
        this.state = { text: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleChange(event) {
        this.setState({ text: event.target.value });
    }

    handleSend() {
        if (this.state.text.length > 0) {
            this.props.socket.emit("message", this.state.text);
            this.setState({ text: "" });
        }
    }

    handleKeyDown(event) {
        if (event.keyCode === 13) {     // press [Enter]
            if (!event.shiftKey) {
                event.preventDefault(); // prevent new line
                this.handleSend();
            }
        }
    }

    render() {
        return (
            <div className="flex mx-3">
                <textarea name="text" placeholder="Press [Enter] to send" cols="60"
                    onChange={this.handleChange} value={this.state.text}
                    onKeyDown={this.handleKeyDown}></textarea>
                <div className="send-btn" onClick={this.handleSend}>Send</div>
            </div>
        )
    }
}


InputArea.propTypes = {
    io: PropTypes.object
};

export default InputArea;