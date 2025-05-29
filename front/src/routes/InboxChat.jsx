import React from "react";
import { Link, useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import InboxSidebar from '../components/InboxSidebar.jsx';
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";

import "../styles/Inbox.css"

function Inbox() {
    const { id } = useParams();
    const { user, login, logout, loading } = useContext(AuthContext);
    const [pageLoading, setPageLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [message, setMessage] = useState("");
    
    useEffect(() => {
        const fetchChat = async () => {
            try {
                if (user && id) {
                    const chatsRes = await fetch(`http://127.0.0.1:3001/inbox/getChat/${id}`);
                    const chatsJson = await chatsRes.json();
                    setChatData(chatsJson);
                    setPageLoading(true);
                }
            } catch (e) {
                console.error("Failed to fetch chats: ", e);
            }
        }
        fetchChat();
    }, [user, id]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (user && chatData) {
                    const otherUserId = chatData.members.find(member => member !== user.id);
                    const otherUserRes = await fetch(`http://127.0.0.1:3001/inbox/getUser/${otherUserId}`);
                    const otherUserJson = await otherUserRes.json();
                    setOtherUser(otherUserJson);

                    const userRes = await fetch(`http://127.0.0.1:3001/inbox/getUser/${user.id}`);
                    const userJson = await userRes.json();
                    setUserData(userJson);
                    setPageLoading(false);
                }
            } catch (e) {
                console.error("Failed to fetch user: ", e);
            }
        }
        fetchUser();
    }, [user, chatData]);

    const addMessage = async () => {
        if (message == "") {
            return
        }
        const userMessage = {
            userId: user.id,
            message: message
        }

        const updatedChat = {
            ...chatData,
            messages: [...chatData.messages, userMessage]
        };

        setChatData(updatedChat);
        setMessage("");

        try {
            const res = await fetch("http://127.0.0.1:3001/inbox/updateChat", {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    chatData: updatedChat
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                console.error("Update failed:", errorData);
            }
        } catch (e) {
            console.error("Error updating messages: ", e);
        }
    }

    if (loading || pageLoading) {
        return (
          <>
            <div className="inboxFlex">
                <Sidebar/>
                <InboxSidebar/>
            </div>
            <div className="inbox-main-content">
                <div className="chatHeader">

                </div>
                <div className="inboxDefaultMessage">
                    
                </div>
                <div className="inboxInputContainer">
                    <input className="inboxInputField" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)}/>
                    <button className="inboxInputSendButton">Send</button>
                </div>
            </div>
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
                        <Link className="chatHeaderLink" to={`http://127.0.0.1:5173/profile/${otherUser.id}`}>
                            <img className="chatUserImage" src={otherUser.profile_picture} />
                            <div className="chatUserName">{otherUser.name}</div>
                        </Link>
                    </div>
                    {chatData.messages && chatData.messages.length > 0 ? (
                        <div className="chatMessageContainer">
                            {chatData.messages.map((message, idx) => {
                                if(message.userId === user.id) {
                                    return (
                                        <div key={idx} className="userChatContainer">
                                            <div className="userChatMessage">
                                                {message.message}
                                            </div>
                                            <img className="userChatPicture" src={userData.profile_picture}/>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={idx} className="otherUserChatContainer">
                                            <img className="userChatPicture" src={otherUser.profile_picture}/>
                                            <div className="otherUserChatMessage">
                                                {message.message}
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    ) : (
                        <div className="inboxDefaultMessage">
                            Be the first to send a message!
                        </div>
                    )}
                    <div className="inboxInputContainer">
                        <input className="inboxInputField" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)}/>
                        <button className="inboxInputSendButton" onClick={() => addMessage()}>Send</button>
                    </div>
                </div>
            </>
        )
      }
}

export default Inbox