import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/register.css";
import "./styles/mainPage.css";
import "./styles/nhnmn.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import PublicIndex from "./components/PublicIndex";
import Home from "./components/Home";

function App() {
  const username = localStorage.getItem("username");
  const isLoggedIn = username !== null;

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route path="/">
          {isLoggedIn ? <Home /> : <PublicIndex />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
