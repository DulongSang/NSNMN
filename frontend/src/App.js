import React from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";

function App() {
  return (
    <Router>
    <div>
      <Navbar />
      <div className="flex" style={{height: "90vh"}}>
        <Sidebar />
        <div className="main-container">
          <Route path="/chat" component={Chat} exact/>
        </div>
      </div>
    </div>
    </Router>
  );
}

export default App;
