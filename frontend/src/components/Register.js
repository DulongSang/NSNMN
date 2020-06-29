import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { EyeSlash, Eye, ExclamationCircleFill } from "react-bootstrap-icons";
import logo from "../images/unicorn.png";
import config from "../config.json";


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPwd: false,
      username: "",
      password: "",
      confirm: "",
      errorInfo: null,
      redirect: false
    };

    this.showHidePassword = this.showHidePassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showHidePassword() {
    this.setState(prevState => ({showPwd: !prevState.showPwd }));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const loginInfo = { 
      username: this.state.username,
      password: this.state.password,
      confirm: this.state.confirm
    };

    const http = new XMLHttpRequest();
    const url = config.hostOrigin + "/api/user/register";
    http.open("POST", url, true);
    http.setRequestHeader("Content-Type", "application/json");

    http.onreadystatechange = () => {
      // state 4: done
      if (http.readyState !== 4) {
        return;
      }

      // !TODO: handle response and redirect
      if (http.status === 200) {
        const { token, username } = JSON.parse(http.responseText);
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        this.setState({ redirect: true });  // redirect
      } else {
        this.setState({ errorInfo: http.responseText });
      }
    };
    http.send(JSON.stringify(loginInfo));
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/app/chat" />; // redirect to chat page
    }

    return (
      <div className="login-container">
        <form className="login-form">
          <img src={logo} alt="unicorn" width="60px" height="60px" />
          <h1>NSNMN Login</h1>

          <div className="hint">You can only use letters & numbers</div>
          <div className="textb">
            <input type="text" name="username" autoComplete="off" spellCheck="false"
              value={this.state.username} onChange={this.handleChange} required />
            <div className="placeholder">Username</div>
          </div>
          
          <div className="hint">Use 6 or more characters</div>
          <div className="textb">
            <input type={this.state.showPwd ? "text" : "password"} name="password" 
              value={this.state.password} onChange={this.handleChange} required/>
            <div className="placeholder">Password</div>
            <div style={{position: "absolute", top: "20%", right: "5%",
              color: "#9d9d9d", fontSize: "26px", cursor: "pointer"}}
              onClick={this.showHidePassword} >
            {this.state.showPwd ? <Eye /> : <EyeSlash />}
            </div>
          </div>

          <div className="textb">
            <input type={this.state.showPwd ? "text" : "password"} name="confirm" 
              value={this.state.confirm} onChange={this.handleChange} required/>
            <div className="placeholder">Confirm</div>
          </div>

          <div className={`info-container ${this.state.errorInfo ? "": "hide"}`}>
            <ExclamationCircleFill style={{marginRight: "6px", bottom: "0.1em", position: "relative"}} />
            <span id="info-msg">{this.state.errorInfo}</span>
          </div>
          <input className="login-btn" type="submit" value="Sign up" onClick={this.handleSubmit} />
          <div style={{marginTop: "20px"}}>
            <span>Already have an account?</span><a href="/login">Sign in</a>
          </div>
        </form>
      </div>
    );
  }
}
