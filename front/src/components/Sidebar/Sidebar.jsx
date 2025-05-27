import { Link } from "react-router-dom";
import Dupifylogo from "./dupifylogo.png"
import "./Sidebar.css";

export default function Sidebar() {
    return (
        <>
        <div className="sidebar">
            <div className="logo-container">
        <Link to="/">
          <img src={Dupifylogo} alt="Dupify-logo" className="sidebar-logo" />
        </Link>
        <h1 className = "logo-title">Dupify</h1>
        </div>
        {/* To jacob wrap the user-card with the Link object like above to route it */}
         <div className="user-card">
            <div className="avatar">
                {/* u can stuff image here */}
            </div>
            <div className="user-info">
            <p className="name">Alex Johnson</p>
            <p className="premium">Premium</p>
            </div>
        </div>

        {/* Menu Navigation here */}
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
            <Link to="/liked">Liked Songs</Link>
            <Link to="/profile">My Profile</Link>
        </div>

        <div className="space-padding">
        </div>

        <div className="section">
            <p className="section-label">Social</p>
            <Link to="/inbox" className="inbox-link">
             Inbox <span className="badge">3</span>
            </Link>
            <Link to="/forum" className="forum-link active"> Forum</Link>
        </div>

        <div className="space-padding2"></div>


        <div className="footer">© 2025 Dupify</div>

        </div>
        </>
    )
}