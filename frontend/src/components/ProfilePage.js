import React, { Component } from 'react';

import request from "../utils/httpRequest";

class ProfilePage extends Component {
    constructor(props) {
        super(props);

        const username = localStorage.getItem("username");
        this.state = { username, upload: null };
        request("/api/user/" + username, "GET", null, response => {
            if (response.status === 200) {
                const user = JSON.parse(response.text);
                this.setState({ name: user.name });
                this.setState({ avatar: user.avatar });
            } else {
                alert(response.text);
            }
        });

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
                if (response.status === 200) {
                    alert("Your profile has been updated");
                    window.location.replace("/app");
                } else {
                    alert(response.text);
                }
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
                    className="edit-avatar" alt="avatar" /><br />
                <input type="file" accept="image/jpeg" name="avatar" onChange={this.handleFileChange} />
                <br /><br />
                <input className="login-btn" type="submit" value="Submit" onClick={this.handleSubmit} />
            </form>
        );
    }
}

export default ProfilePage;