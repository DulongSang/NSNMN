import React from 'react';
import logo from "../images/unicorn.png";

function MainPage() {
    return (
        <div>
            <h1 className="main-title">Black Lives Matter!</h1>
            <h1 className="brand">
                <img src={logo} alter="logo" />
                NSNMN
            </h1>
            <div className="flex main-page-container">
                <a href="/register">
                    <div className="main-block main-signup">Sign up</div>
                </a>
                <a href="/login">
                    <div className="main-block main-login">Login</div>
                </a>
            </div>
        </div>
    );
}


export default MainPage;