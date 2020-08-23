import React from "react";
import { Route } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import ProfilePage from "./ProfilePage";
import NHNMN from "./NHNMN/NHNMN";

function Home() {
    return (
        <div>
            <Navbar />
            <div className="flex" style={{height: "85vh"}}>
                <Route exact path="/profile" component={ProfilePage} />
                <Route exact path="/app/chat">
                    <Sidebar />
                    <div className="main-container">
                        <Chat />
                    </div>
                </Route>
                <Route exact path="/app/nhnmn">
                    <NHNMN />
                </Route>
            </div>
        </div>
    );
}

export default Home;