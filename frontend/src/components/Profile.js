import React, { Component } from 'react';
import { CaretDown, BoxArrowInRight } from "react-bootstrap-icons";
import { connect } from "react-redux";

import { updateUser } from "../redux/actions";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.user;
    }

    logout() {
        // clear localStorage
        localStorage.removeItem("token");

        // clear the store
        this.props.updateUser({ token: null, user: null });
    
        // redirect to main page
        window.location.replace("/");
    }

    render() {
        return (
            <div className="profile flex">
                <img src={this.state.avatar} className="avatar" alt="avatar" />
                <div>
                    <span style={{fontSize: "18px", color: "blue"}}>{this.state.username}</span><br />
                    <span>{this.state.name}</span>
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

const mapStateToProps = state => ({
    user: state.user
});

const mapDispatchToProps = { updateUser };

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);