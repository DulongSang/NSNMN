import React, { useState } from 'react';
import { CaretDown, BoxArrowInRight, Person } from "react-bootstrap-icons";

import request from "../utils/httpRequest";

function Profile(props) {
    const username = localStorage.getItem("username");

    const [name, setName] = useState("default");
    const [avatar, setAvatar] = useState("default");
    const [credit, setCredit] = useState(0);

    request("/api/user/" + username, "GET", null, response => {
        if (response.status === 200) {
            const user = JSON.parse(response.text);
            setName(user.name);
            setAvatar(user.avatar);
            setCredit(user.credit);
        } else {
            console.log(response.text);
        }
    });

    const logout = () => {
        // clear localStorage
        localStorage.clear();
    };

    return (
        <div className="profile flex">
            <img src={avatar} className="avatar" alt="avatar" />
            <div>
                <span style={{fontSize: "18px", color: "blue"}}>{name}</span><br />
                <span>Credit: {credit}</span>
            </div>
            <CaretDown style={{margin: "15px 10px", fontSize: "20px"}} />
            <div className="dropdown-content">
                <a href="/profile">
                    <div>
                        <Person style={{marginRight: "10px"}} />
                        Profile
                    </div>
                </a>
                <a href="/" onClick={logout}>
                    <div>
                        <BoxArrowInRight style={{marginRight: "10px"}}/>
                        Log out
                    </div>
                </a>
            </div>
        </div>
    );
}

export default Profile;