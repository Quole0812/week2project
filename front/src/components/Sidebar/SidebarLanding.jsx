import { useContext, useEffect, useState } from "react";
import { Link }           from "react-router-dom";
import Dupifylogo         from "./dupifylogo.png";
import "./SidebarLanding.css";
import { AuthContext }    from "../../components/AuthContext";

export default function Sidebar() {
  const { user, login, logout, loading } = useContext(AuthContext);

  const [recentSongs, setRecentSongs] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch("http://127.0.0.1:3001/api/recently-played?limit=5", {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(({ songs }) => setRecentSongs(songs || []))
      .catch(() => setRecentSongs([]));
  }, [user]);

  if (loading) return <div className="sidebar" />;

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/">
          <img src={Dupifylogo} alt="Dupify-logo" className="sidebar-logo" />
        </Link>
        <h1 className="logo-title">Dupify</h1>
      </div>

      {user ? (
        <>
          {/* user card */}
          <Link className="no-link-style" to={`/profile/${user.id}`}>
            <div className="user-card">
              {user.images?.[1]?.url ? (
                <img className="avatar1" src={user.images[1].url} />
              ) : (
                <div className="avatar-placeholder">{user.display_name[0]}</div>
              )}
              <div className="user-info">
                <p className="name">{user.display_name}</p>
                <p className="premium">
                  {user.product.charAt(0).toUpperCase() + user.product.slice(1)}
                </p>
              </div>
            </div>
          </Link>

          {/* ——— LIBRARY ——— */}
          <div className="section">
            <p className="section-label">Library</p>
            <Link to="/liked">Liked Songs</Link>
          </div>
         
          <div className="space-padding"></div>

            {/* Recently played list */}
        <div className="section">
            <p className="section-label">Recently Played</p>
            <div className="space-padding"></div>
                <div>
                    {recentSongs.length === 0 ? (
                <span className="empty-recent">No history yet.</span>
                ) : (
                  <ul className="recent-list">
                    {recentSongs.map((t) => (
                      <li key={t.id} className="recent-item">
                        <img
                          src={t.image || t.album?.images?.[0]?.url || "/default-song.png"}
                          alt={t.name}
                          className="recent-img"
                        />
                        <span className="recent-title">{t.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                </div>
            </div>
        </>
      ) : (
        /* logged-out view */
        <>
          <div className="section">
            <p className="section-label">Library</p>
            <Link onClick={login}>Liked&nbsp;Songs</Link>
            <p className="subsection-label">Recently&nbsp;played</p>
            <span className="empty-recent">Log in to see your history</span>
          </div>
        </>
      )}

      {/* footer / login-logout */}
      <div className="footerContainer">
        {user ? (
          <div className="loginContainer">
            <button className="login" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="loginContainer">
            <button className="login" onClick={login}>
              Login
            </button>
          </div>
        )}
        <div className="footer">© 2025 Dupify</div>
      </div>
    </div>
  );
}
