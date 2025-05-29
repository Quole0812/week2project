import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./AuthContext";

import "@fontsource/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";

import "../styles/InboxSidebar.css";

function InboxSidebar() {
    const { id } = useParams();

    const { user, login, logout, loading } = useContext(AuthContext);
    const [pageLoading, setPageLoading] = useState(true);
    const [userChats, setUserChats] = useState([]);
    const [updatedChats, setUpdatedChats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const chatsRes = await fetch(`http://127.0.0.1:3001/inbox/getChats/${user.id}`);
                    const chatsJson = await chatsRes.json();
                    setUserChats(chatsJson);
                }
                
            } catch (e) {
                console.error("Failed to fetch chats: ", e);
            }
            
        }
        fetchData();
    }, [user])

    useEffect(() => {
        const fetchUser = async (id) => {
            try {
                if (user) {
                    const userRes = await fetch(`http://127.0.0.1:3001/inbox/getUser/${id}`);
                    const userJson = await userRes.json();
                    return userJson;
                }
            } catch (e) {
                console.error("Failed to fetch user: ", e);
            }
        }

        const fetchData = async () => {
            const chats = await Promise.all(userChats.map(async (chat) => {
                const otherUserId = chat.members.find(id => id !== user.id);
                const otherUser = await fetchUser(otherUserId);
                return {
                    ...chat,
                    otherUser
                }
            }))
            setUpdatedChats(chats)
        }

        if (userChats && userChats.length > 0) {
            fetchData();
        }
        setPageLoading(false);
    }, [userChats, user])

    if(loading || pageLoading) {
        return (
            <div className="inboxSidebar">
                <div className="sidebarHeader">Messages</div>
            </div>
        )
    } else {
        return (
            <>
                <div className="inboxSidebar">
                <div className="sidebarHeader">Messages</div>
                {userChats && userChats.length > 0 ? (
                    <>
                        {updatedChats.map((chat) => (
                            <Link key={chat.id} className="chatLink" to={`/inbox/${chat.id}`}>
                                <div
                                className={`chatLinkContainer ${
                                    chat.id === id ? "chatLinkContainerSelected" : ""
                                }`}
                                >
                                <img className="chatUserImage" src={chat.otherUser.profile_picture} />
                                <div className="chatUserName">{chat.otherUser.name}</div>
                                </div>
                            </Link>
                        ))}
                    </>
                ) : (
                        <div className="inboxCenter">
                            {/* No chats yet. */}
                        </div>
                )}
                </div>
            </>
        )
    }
}

export default InboxSidebar
