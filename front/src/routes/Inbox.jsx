import React from "react";
import { Link, useParams } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import InboxSidebar from '../components/InboxSidebar.jsx';
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";

import "../styles/Inbox.css"

function Inbox() {
    const { user, login, logout, loading } = useContext(AuthContext);

    if (loading) {
        return (
          <>
            <Sidebar/>
            <InboxSidebar/>
          </>
        )
      } else {
        return (
            <>
                <div className="inboxFlex">
                    <Sidebar/>
                    <InboxSidebar/>
                </div>
                <div className="inbox-main-content">
                    <div className="chatHeader">
                    </div>
                    {user ? (
                        <div className="inboxDefaultMessage">
                            Send a message to start a chat!
                            <Link className="browseProfilesLink" to={"/discover"}>
                                <button className="browseProfilesButton">Browse Profiles</button>
                            </Link>
                        </div>
                    ) : (
                        <div className="inboxDefaultMessage">
                            Must sign in to view this page.
                        </div>
                    )}
                    <div className="inboxInputContainer">
                        <input className="inboxInputField" placeholder="Type a message..." />
                        <button className="inboxInputSendButton">Send</button>
                    </div>
                </div>
            </>
        )
      }
}

export default Inbox