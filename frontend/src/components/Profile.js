import React, { Component } from 'react';

import profile from "../images/kirino.jpg";


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {fillRule: "evenodd"};
    }

    render() {
        return (
            <div className="flex">
                <img src={profile} className="profile"></img>
                <div>
                    <span>TestUser</span><br />
                    <span>TestLevel</span>
                </div>
                <div style={{padding: "10px 5px"}}>
                    <svg className="bi bi-caret-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule={this.state.fillRule} d="M3.204 5L8 10.481 12.796 5H3.204zm-.753.659l4.796 5.48a1 1 0 0 0 1.506 0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 0 0-.753 1.659z"/>
                    </svg>
                </div>
            </div>
        );
    }
}

export default Profile;