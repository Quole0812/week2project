import { Link } from "react-router-dom";
import Dupifylogo from "./dupifylogo.png"
import "./Sidebar.css";
import { useContext } from "react";
import { AuthContext } from "../../components/AuthContext";

export default function Sidebar() {
    const { user, login, logout, loading } = useContext(AuthContext);
    if(loading) {
        return <></>
    } else {
        return (
            <>
                <div className="sidebar">
                    <div className="logo-container">
                    <Link to="/">
                    <img src={Dupifylogo} alt="Dupify-logo" className="sidebar-logo" />
                    </Link>
                    <h1 className = "logo-title">Dupify</h1>
                    </div>
                    {user ? (
                        // logged in view
                        <>
                            <Link className="no-link-style" to={`/profile/${user.id}`}>
                                <div className="user-card">
                                    <img className="avatar" src={user.images[1].url}></img>
                                    <div className="user-info">
                                    <p className="name">{user.display_name}</p>
                                    <p className="premium">{user.product.charAt(0).toUpperCase() + user.product.slice(1)}</p>
                                    </div>
                                </div>
                            </Link>

                            <div className="section">
                                <p className="section-label">Menu</p>
                                <Link to="/home">Home</Link>
                                <Link to="/discover">Discover</Link>
                                <Link to="/top-artists">Top Artists</Link>
                                <Link to="/top-songs">Top Songs</Link>
                            </div>

                            <div className="space-padding">
                            </div>

                            <div className="section">
                                <p className="section-label">Library</p>
                                <Link to={`/profile/${user.id}`}>My Profile</Link>
                                <Link to="/liked">Liked Songs</Link>
                            </div>

                            <div className="space-padding">
                            </div>

                            <div className="section">
                                <p className="section-label">Social</p>
                                <Link to="/inbox" className="inbox-link">
                                Inbox 
                                {/* <span className="badge">3</span> */}
                                </Link>
                                <Link to="/forum" className="forum-link active"> Forum</Link>
                            </div>
                        </>
                    ) : (
                        // logged out view
                        <>
                            <div className="section">
                                <p className="section-label">Menu</p>
                                <Link to="/home">Home</Link>
                                <Link to="/discover">Discover</Link>
                                <Link to="/top-artists">Top Artists</Link>
                                <Link to="/top-songs">Top Songs</Link>
                            </div>

                            <div className="space-padding">
                            </div>

                            <div className="section">
                                <p className="section-label">Library</p>
                                <Link to={`/`}>My Profile</Link>
                                <Link to="/liked">Liked Songs</Link>
                            </div>

                            <div className="space-padding">
                            </div>

                            <div className="section">
                                <p className="section-label">Social</p>
                                <Link to="/inbox" className="inbox-link">
                                Inbox 
                                {/* <span className="badge">3</span> */}
                                </Link>
                                <Link to="/forum" className="forum-link active"> Forum</Link>
                            </div>
                        </>
                    )}

                    <div className="footerContainer">
                        {user ? (
                            <div className="loginContainer">
                                <button className="login" onClick={() => logout()}>Logout</button>
                            </div>
                        ) : (
                            <div className="loginContainer">
                                <button className="login" onClick={() => login()}>Login</button>
                            </div>
                        )}
                        <div className="footer">
                            © 2025 Dupify
                        </div>
                    </div>
                </div>
            </>
    )
    }
}