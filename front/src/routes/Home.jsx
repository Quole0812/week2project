import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const { user, login, loading } = useContext(AuthContext);

  const [topArtists, setTopArtists] = useState([]);
  const [topSongs,   setTopSongs]   = useState([]);

  const fetchJSON = (url) =>
    fetch(url, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)));

  useEffect(() => {
    if (!user) return;

    fetchJSON("http://127.0.0.1:3001/api/top-artists?limit=3")
      .then((data) => setTopArtists(data.items || []))
      .catch((err) => console.error("top artists:", err));

    fetchJSON("http://127.0.0.1:3001/api/top-songs?limit=4")
      .then((data) => setTopSongs(data.items || []))
      .catch((err) => console.error("top songs:", err));
  }, [user]);

  if (!user && !loading) {
    return (
      <>
        <Sidebar />
        <main className="home-container">
          <button className="login-btn" onClick={login}>
            Login with Spotify
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="home-container">
        {/* Banner */}
        <section className="discover-card">
          <div className="discover-info">
            <h2>Discover Users</h2>
            <p>
              Connect with fellow music lovers and create a community exploring
              new sounds together.
            </p>
            <Link to="/discover" className="connect-btn">
              Connect Now
            </Link>
        </div>
          <div className="disc-art" />
        </section>

        <section className="two-col">
          {/* Top Artists */}
          <div className="dark-panel">
            <header className="panel-head">
              <h3>Your Top Artists</h3>
              <a href="/top-artists">View All</a>
            </header>

            {topArtists.length === 0 ? (
              <p className="empty-note">No data yet.</p>
            ) : (
              <div className="artist-grid">
                {topArtists.map((a) => (
                  <div key={a.id} className="artist-card">
                    <div
                      className="avatar"
                      style={{
                        backgroundImage: `url(${a.image})`,
                      }}
                    />
                    <h4>{a.name}</h4>
                    <span className="plays">{a.play_count} plays</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Top Songs */}
          <div className="dark-panel">
            <header className="panel-head">
              <h3>Your Top Songs</h3>
              <a href="/top-songs">View All</a>
            </header>

            {topSongs.length === 0 ? (
              <p className="empty-note">No data yet.</p>
            ) : (
              <ol className="song-list">
                {topSongs.map((s, idx) => (
                  <li key={s.id}>
                    <span className="rank">{String(idx + 1).padStart(2, "0")}</span>
                    <div className="song-meta">
                      <strong>{s.name}</strong>
                      <em>{s.artist}</em>
                    </div>
                    <span className="plays">{s.play_count} plays</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </main>
    </>
  );
}