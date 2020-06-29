import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import config from "../config.json";

class ProfilePage extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const file = document.getElementById("upload-avatar").files[0];
        if (file.size > 2097152) {  // 2 MB
            alert("File size should be less than 2MB!");
            return;
        }

        const form = document.getElementById("edit-profile");
        const token = localStorage.getItem("token");
        const xhr = new XMLHttpRequest();
        const url = config.hostOrigin + "/api/upload/avatar";
        xhr.open("POST", url);
        xhr.setRequestHeader("Authorization", token);

        xhr.onreadystatechange = () => {
            // state 4: done
            if (xhr.readyState !== 4) {
                return;
            }

            if (xhr.status === 200) {
                alert("success");
                window.location.replace("/app");
            } else {
                console.log(xhr.responseText);
            }
        };
        xhr.send(new FormData(form));
    }

    render() {
        return (
            <div>
                <form id="edit-profile" encType="multipart/form-data">
                    <label htmlFor="upload-avatar">Upload your profile picture</label><br />
                    <input type="file" id="upload-avatar" name="avatar" accept="image/jpeg" /><br />
                    <input type="submit" value="submit" onClick={this.handleSubmit} />
                </form>
                <a href="/app">Go back</a>
            </div>
        )
    }
}

export default ProfilePage;