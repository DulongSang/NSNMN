import React, { Component } from 'react';
import { EyeSlash, Eye, ExclamationCircleFill } from "react-bootstrap-icons";
import { connect } from "react-redux";

import logo from "../images/unicorn.png";
import request from "../utils/httpRequest";
import { updateUser } from "../redux/actions";

class Login extends Component {
  constructor(props) {
    super(props);

    this.autoLogin();

    this.state = {
      showPwd: false,
      username: "",
      password: "",
      remember: true,
      errorInfo: null
    };

    this.showHidePassword = this.showHidePassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // auto login if token is valid
  autoLogin() {
    if (this.props.token === null) return;

    const header = { Authorization: this.props.token };
    request("/api/user/auth", "POST", { header }, response => {
      if (response.status === 200) {
        const { user } = JSON.parse(response.text);

        // update store
        store.dispatch({
          type: "UPDATE",
          payload: { user }
        });

        window.location.replace("/app");  // redirect
      } else {
        console.log(response.text);
      }
    });
  }

  showHidePassword() {
    this.setState(prevState => ({showPwd: !prevState.showPwd }));
  }

  handleChange(event) {
    const name = event.target.name;
    if (name === "remember") {
      this.setState({ [name]: event.target.checked });
    } else {
      this.setState({ [name]: event.target.value });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const loginInfo = { 
      username: this.state.username,
      password: this.state.password
    };

    const options = {
      header: { "Content-Type": "application/json" },
      body: JSON.stringify(loginInfo)
    };
    request("/api/user/auth", "POST", options, response => {
      if (response.status === 200) {
        const { token, user } = JSON.parse(response.text);

        // update store
        this.props.updateUser({ token, user });

        // store token if user selects "remember me"
        if (this.state.remember) {
          localStorage.setItem("token", token);
        }
      } else {
        this.setState({ errorInfo: response.text });
      }
    });
  }

  render() {
    return (
      <div className="login-container">
        <form className="login-form">
          <a href="/">
            <img src={logo} alt="unicorn" width="60px" height="60px" />
            <h1>NSNMN Login</h1>
          </a>

          <div className="textb">
            <input type="text" name="username" autoComplete="off" spellCheck="false"
              value={this.state.username} onChange={this.handleChange} required />
            <div className="placeholder">Username</div>
          </div>
          
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

          <div className={`info-container ${this.state.errorInfo ? "": "hide"}`}>
            <ExclamationCircleFill style={{marginRight: "6px", bottom: "0.1em", position: "relative"}} />
            <span id="info-msg">{this.state.errorInfo}</span>
          </div>
          <input className="login-btn" type="submit" value="Login" onClick={this.handleSubmit} />
          <div className="checkbox">
            <input type="checkbox" name="remember" 
              checked={this.state.remember} onChange={this.handleChange} />
            Remember me
          </div>
          <div style={{marginTop: "20px"}}>
            <span>Don't have an account?</span><a href="/register">Create one</a>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token
});

const mapDispatchToProps = { updateUser };


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);