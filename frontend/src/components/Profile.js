import React from 'react';
import { CaretDown, BoxArrowInRight } from "react-bootstrap-icons";

import avatar from "../images/kirino.jpg";


function Profile() {
    const username = localStorage.getItem("username");

    return (
        <div className="profile flex">
            <img src={avatar} className="avatar" alt="avatar"></img>
            <div>
                <span style={{fontSize: "18px", color: "blue"}}>{username}</span><br />
                <span>TestLevel</span>
            </div>
            <CaretDown style={{margin: "15px 10px", fontSize: "20px"}} />
            <div className="dropdown-content">
                <div><a>Profile</a></div>
                <div>
                    <a onClick={logout}>Log out</a>
                    <BoxArrowInRight style={{marginLeft: "10px"}}/>
                </div>
            </div>
        </div>
    );
}


function logout() {
    // clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // redirect to main page
    window.location.replace("/");
}

export default Profile;