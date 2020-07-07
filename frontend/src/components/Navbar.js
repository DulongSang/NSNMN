import React from 'react';
import { NavLink } from "react-router-dom";

import Profile from "./Profile";

import logo from "../images/unicorn.png";

function Navbar() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/app/chat">
            <img src={logo} alt="logo" width="30" height="30"></img>
            &nbsp;NSNMN
          </a>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li>
                <NavLink className="nav-link" activeClassName="active" to="/app/dashboard">
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink className="nav-link" activeClassName="active" to="/app/chat">
                  Chat
                </NavLink>
              </li>
            </ul>
            <Profile />
          </div>
        </div>
      </nav>
    );
}

export default Navbar;