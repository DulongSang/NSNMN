import React, { Component } from 'react';
import { connect } from "react-redux";

import { updateUser } from "../redux/actions";
import request from "../utils/httpRequest";

class ProfilePage extends Component {
    constructor(props) {
        super(props);

        const { username, name, avatar } = this.props.user;
        this.state = { username, name, avatar, upload: null };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleNameChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file.size > 2097152) {  // 2 MB
            alert("File size should be less than 2MB!");
            return;
        }
        this.setState({ upload: URL.createObjectURL(file) });
    }

    handleSubmit(event) {
        event.preventDefault();

        // check if name is changed
        if (this.props.user.name !== this.state.name) {
            const options = {
                header: {
                    "Authorization": this.props.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: this.state.name })
            };
            request("/api/user/edit", "POST", options, response => {
                if (response.status === 200) {
                    alert("Your profile has been updated!");
                    window.location.replace("/app");
                } else {
                    alert(response.text);
                }
            });
        }

        // check if avatar changed
        if (this.state.upload) {
            const form = document.getElementById("profile-page");
            const options = {
                header: { "Authorization": this.props.token },
                body: new FormData(form)
            };
            request("/api/upload/avatar", "POST", options, response => {
                alert("Your profile has been updated");
                window.location.replace("/app");
            });
        }
    }

    render() {
        return (
            <form id="profile-page" style={{width: "50%"}}>
                <h1>Edit Profile</h1>
                <label htmlFor="username">Username</label><br />
                <input type="text" value={this.state.username} name="username" disabled/>
                <span className="hint">You may not change your username</span><br /><br />
                <label htmlFor="name">Name</label><br />
                <input type="text" value={this.state.name} name="name" onChange={this.handleNameChange} />
                <span className="hint">This is your name displayed in chat</span><br /><br />
                <label htmlFor="avatar">Upload your avatar</label><br />
                <img src={this.state.upload ? this.state.upload : this.state.avatar} 
                    height="150px" width="150px" alt="avatar" /><br />
                <input type="file" accept="image/jpeg" name="avatar" onChange={this.handleFileChange} />
                <br /><br />
                <input className="login-btn" type="submit" value="Submit" onClick={this.handleSubmit} />
            </form>
        );
    }
}

const mapStateToProps = state => ({ 
    user: state.user,
    token: state.token
});

const mapDispatchToProps = { updateUser };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilePage);