import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/register.css";
import "./styles/mainPage.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Register from "./components/Register";
import MainPage from "./components/MainPage";

function App() {
  return (
    <Router>
      <Route exact path="/" component={MainPage} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route path="/app">
        <div>
          <Navbar />
          <div className="flex" style={{height: "90vh"}}>
            <Sidebar />
            <div className="main-container">
              <Route exact path="/app/chat" component={Chat}/>
            </div>
          </div>
        </div>
      </Route>
    </Router>
  );
}

export default App;
