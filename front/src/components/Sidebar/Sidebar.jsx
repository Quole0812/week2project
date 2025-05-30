import { Link, useLocation } from "react-router-dom";
import Dupifylogo from "./dupifylogo.png"
import "./Sidebar.css";
import { use, useContext, useState } from "react";
import { AuthContext } from "../../components/AuthContext";
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import StarIcon from '@mui/icons-material/Star';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import ArticleIcon from '@mui/icons-material/Article';

export default function Sidebar() {
    const { user, login, logout, loading } = useContext(AuthContext);
    const location = useLocation();
    const hideLinks = location.pathname === "/home";
    const [activeLink, setActiveLink] = useState(location.pathname);

    if (loading) {
        return <div className="sidebar"></div>;
    }

    return (
        <>
            <div className="sidebar">
                <div className="logo-container">
                    <Link to="/">
                        <img src={Dupifylogo} alt="Dupify-logo" className="sidebar-logo" />
                    </Link>
                    <h1 className="logo-title">Dupify</h1>
                </div>

                {user && (
                    <>
                        <Link className="no-link-style" to={`/profile/${user.id}`}>
                            <div className="user-card">
                                <img className="avatar1" src={user.images[1].url}></img>
                                <div className="user-info">
                                    <p className="name">{user.display_name}</p>
                                    <p className="premium">{user.product.charAt(0).toUpperCase() + user.product.slice(1)}</p>
                                </div>
                            </div>
                        </Link>

                        {!hideLinks && (
                            <>
                                <div className="section">
                                    <p className="section-label">Menu</p>
                                    <Link to="/home" className={location.pathname === "/home" ? "link-active" : ""}>
                                        <div className="link-content">
                                            <HomeFilledIcon />
                                            Home
                                        </div>
                                    </Link>
                                    <Link to="/discover" className={location.pathname === "/discover" ? "link-active" : ""}>
                                        <div className="link-content">
                                            <ModeStandbyIcon />
                                            Discover
                                        </div>
                                    </Link>
                                    <Link to="/top-artists" className={location.pathname === "/top-artists" ? "link-active" : ""}>
                                        <div className="link-content">
                                            <StarIcon />
                                            Top Artists
                                        </div>
                                    </Link>
                                    <Link to="/top-songs" className={location.pathname === "/top-songs" ? "link-active" : ""}>
                                        <div className="link-content">
                                            <MusicNoteIcon />
                                            Top Songs
                                        </div>
                                    </Link>
                                </div>

                                <div className="space-padding"></div>

                                <div className="section">
                                    <p className="section-label">Library</p>
                                    <Link to="/liked" className={location.pathname === "/liked" ? "link-active" : ""}>
                                        <div className="link-content">
                                            <FavoriteIcon />
                                            Liked Songs
                                        </div>
                                    </Link>
                                    <Link to={`/profile/${user.id}`} className={location.pathname === `/profile/${user.id}` ? "link-active" : ""}>
                                        <div className="link-content">
                                            <PersonIcon />
                                            My Profile
                                        </div>
                                    </Link>
                                </div>

                                <div className="space-padding"></div>

                                <div className="section">
                                    <p className="section-label">Social</p>
                                    <Link to="/inbox" className={location.pathname === "/inbox" ? "link-active" : "inbox-link"}>
                                        <div className="link-content">
                                            <MailIcon />
                                            Inbox
                                        </div>
                                    </Link>
                                    <Link to="/forum" className={location.pathname === "/forum" ? "link-active" : ""}>
                                        <div className="link-content">
                                            <ArticleIcon />
                                            Forum
                                        </div>
                                    </Link>
                                </div>
                            </>
                        )}
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
                    <div className="footer">© 2025 Dupify</div>
                </div>
            </div>
        </>
    );
}
