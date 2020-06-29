import React, { Component } from 'react';
import { CaretDown, BoxArrowInRight } from "react-bootstrap-icons";

import config from "../config.json";

class Profile extends Component {
    constructor(props) {
        super(props);

        const username = localStorage.getItem("username");
        const avatar = localStorage.getItem("avatar");
        this.state = { username, avatar };
    }

    componentDidMount() {
        if (this.state.avatar) {
            return;
        }

        const xhr = new XMLHttpRequest();
        const url = config.hostOrigin + "/api/user/avatar/" + this.state.username;
        xhr.open("GET", url);
        
        xhr.onreadystatechange = () => {
            // state 4: done
            if (xhr.readyState !== 4) {
                return;
            }
    
            if (xhr.status === 200) {
                const avatar = xhr.responseText;
                this.setState({ avatar });
                localStorage.setItem("avatar", avatar);
            } else {
                alert(xhr.responseText);
            }
        };
        xhr.send();
    }

    logout() {
        // clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("username");
    
        // redirect to main page
        window.location.replace("/");
    }

    render() {
        return (
            <div className="profile flex">
                <img src={config.hostOrigin + `/src/avatars/${this.state.avatar}`} 
                    className="avatar" alt="avatar" />
                <div>
                    <span style={{fontSize: "18px", color: "blue"}}>{this.state.username}</span><br />
                    <span>TestLevel</span>
                </div>
                <CaretDown style={{margin: "15px 10px", fontSize: "20px"}} />
                <div className="dropdown-content">
                    <a href="/app/profile" style={{textDecoration: "none"}}><div>Profile</div></a>
                    <div>
                        <a onClick={this.logout}>Log out</a>
                        <BoxArrowInRight style={{marginLeft: "10px"}}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;