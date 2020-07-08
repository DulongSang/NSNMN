import React, { Component } from 'react';
import { CaretDown, BoxArrowInRight } from "react-bootstrap-icons";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { updateUser } from "../redux/actions";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = { redirect: false };

        this.logout = this.logout.bind(this);
    }

    logout() {
        // clear localStorage
        localStorage.removeItem("token");
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to="/app/profile" />;
        }

        const { username, name, avatar } = this.props.user;
        return (
            <div className="profile flex">
                <img src={avatar} className="avatar" alt="avatar" />
                <div>
                    <span style={{fontSize: "18px", color: "blue"}}>{username}</span><br />
                    <span>{name}</span>
                </div>
                <CaretDown style={{margin: "15px 10px", fontSize: "20px"}} />
                <div className="dropdown-content">
                    <div onClick={() => this.setState({ redirect: true })}>Profile</div>
                    <div>
                        <a href="/" onClick={this.logout}>Log out</a>
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