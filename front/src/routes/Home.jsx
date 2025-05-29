import { useEffect, useState, useContext } from "react";
import { AuthContext }   from "../components/AuthContext";
import SidebarLanding          from "../components/Sidebar/SidebarLanding";
import { Link }          from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const { user, login, loading } = useContext(AuthContext);

  const [topArtists, setTopArtists] = useState([]);
  const [topSongs,   setTopSongs]   = useState([]);
  const [messages,   setMessages]   = useState([]);
  const [threads,    setThreads]    = useState([]);

  const fetchJSON = (url) =>
    fetch(url, { credentials: "include" }).then((r) => (r.ok ? r.json() : []));
    fetch(url, { credentials: "include" }).then((r) => (r.ok ? r.json() : []));

  useEffect(() => {
    if (!user) return;

    fetchJSON("http://127.0.0.1:3001/api/top-artists?limit=3")
      .then((d) => setTopArtists((d.items || []).sort((a,b)=>b.play_count-a.play_count)))
      .catch(console.error);
      .then((d) => setTopArtists((d.items || []).sort((a,b)=>b.play_count-a.play_count)))
      .catch(console.error);

    fetchJSON("http://127.0.0.1:3001/api/top-songs?limit=4")
      .then((d) => setTopSongs((d.items || []).sort((a,b)=>b.play_count-a.play_count)))
      .catch(console.error);

    fetchJSON("http://127.0.0.1:3001/api/messages?limit=3")
      .then((d) => setMessages(d.items || []))
      .catch(console.error);

    fetchJSON("http://127.0.0.1:3001/api/forum-activity?limit=2")
      .then((d) => setThreads(d.items || []))
      .catch(console.error);
      .then((d) => setTopSongs((d.items || []).sort((a,b)=>b.play_count-a.play_count)))
      .catch(console.error);

    fetchJSON("http://127.0.0.1:3001/api/messages?limit=3")
      .then((d) => setMessages(d.items || []))
      .catch(console.error);

    fetchJSON("http://127.0.0.1:3001/api/forum-activity?limit=2")
      .then((d) => setThreads(d.items || []))
      .catch(console.error);
  }, [user]);

  if (!user && !loading)
  if (!user && !loading)
    return (
      <>
        <SidebarLanding />
        <main className="home-container">
          <button className="login-btn" onClick={login}>
            Login with Spotify
          </button>
        </main>
      </>
    );

  return (
    <>
      <SidebarLanding />
      <main className="home-container">
        <h1 className="page-title">Home</h1>

        <h1 className="page-title">Home</h1>

        <section className="discover-card">
          <div className="discover-info">
            <h2>Discover Users</h2>

            <p>
              Connect with fellow music lovers and create a community
              exploring new sounds together.
            </p>

            <Link to="/discover" className="connect-btn">
              Connect Now
            </Link>
          </div>

          <div className="disc-art" />
      </section>

        <section className="two-col">
          <div className="dark-panel">
            <header className="panel-head">
              <h3>Your Top Artists</h3>
              <Link to="/top-artists">View All</Link>
              <Link to="/top-artists">View All</Link>
            </header>

            {topArtists.length === 0 ? (
              <p className="empty-note">No data yet.</p>
            ) : (
              <div className="artist-grid">
                {topArtists.map((a) => {
                  const imgSrc =
                    a.images?.[0]?.url
                    || a.image
                    || "/default-artist.png";

                  return (
                    <div key={a.id} className="artist-card">
                      <div className="artist-list-image-container">
                        <img
                          src={imgSrc}
                          alt={a.name}
                          className="artist-list-image"
                        />
                      </div>
                      <h4 className="artist-grid-name">{a.name}</h4>
                    </div>
                  );
                })}
                {topArtists.map((a) => {
                  const imgSrc =
                    a.images?.[0]?.url
                    || a.image
                    || "/default-artist.png";

                  return (
                    <div key={a.id} className="artist-card">
                      <div className="artist-list-image-container">
                        <img
                          src={imgSrc}
                          alt={a.name}
                          className="artist-list-image"
                        />
                      </div>
                      <h4 className="artist-grid-name">{a.name}</h4>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="dark-panel">
            <header className="panel-head">
              <h3>Your Top Songs</h3>
              <Link to="/top-songs">View All</Link>
              <Link to="/top-songs">View All</Link>
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
                    
                    
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        <section className="triple-col">
          <div className="dark-panel profile-card">
            <header className="panel-head">
              <h3>Your Profile</h3>
              <Link to={`/profile/${user?.id}`}>Edit Profile</Link>
            </header>

            <div className="profile-row">
              <div
                className="avatar-lg"
                style={{
                  backgroundImage: `url(${user?.images?.[0]?.url || ""})`,
                }}
              >
                {!user?.images?.length && user?.display_name?.[0]}
              </div>
              <div className="profile-meta">
                <h4>{user?.display_name}</h4>
                <span className="handle">@{user?.id}</span>
              </div>
            </div>
          </div>

          <div className="dark-panel">
            <header className="panel-head">
              <h3>Recent Messages</h3>
              <span className="pill">{messages.length}</span>
            </header>

            {messages.length === 0 ? (
              <p className="empty-note">No messages yet.</p>
            ) : (
              <ul className="message-list">
                {messages.map((m) => (
                  <li key={m.id}>
                    <span className="avatar-sm">{m.sender_initials}</span>
                    <div className="msg-meta">
                      <strong>{m.sender}</strong>
                      <small>{m.snippet}</small>
                    </div>
                    <small className="time">{m.age}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dark-panel">
            <header className="panel-head">
              <h3>Forum Activity</h3>
              <Link to="/forum">View All</Link>
            </header>

            {threads.length === 0 ? (
              <p className="empty-note">No threads yet.</p>
            ) : (
              <ul className="forum-list">
                {threads.map((t) => (
                  <li key={t.id}>
                    <span className="avatar-sm tag">🎵</span>
                    <div className="thread-meta">
                      <strong>{t.title}</strong>
                      <small>{t.snippet}</small>
                    </div>
                    <small className="replies">
                      {t.replies} replies · {t.age}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="triple-col">
          <div className="dark-panel profile-card">
            <header className="panel-head">
              <h3>Your Profile</h3>
              <Link to={`/profile/${user?.id}`}>Edit Profile</Link>
            </header>

            <div className="profile-row">
              <div
                className="avatar-lg"
                style={{
                  backgroundImage: `url(${user?.images?.[0]?.url || ""})`,
                }}
              >
                {!user?.images?.length && user?.display_name?.[0]}
              </div>
              <div className="profile-meta">
                <h4>{user?.display_name}</h4>
                <span className="handle">@{user?.id}</span>
              </div>
            </div>
          </div>

          <div className="dark-panel">
            <header className="panel-head">
              <h3>Recent Messages</h3>
              <span className="pill">{messages.length}</span>
            </header>

            {messages.length === 0 ? (
              <p className="empty-note">No messages yet.</p>
            ) : (
              <ul className="message-list">
                {messages.map((m) => (
                  <li key={m.id}>
                    <span className="avatar-sm">{m.sender_initials}</span>
                    <div className="msg-meta">
                      <strong>{m.sender}</strong>
                      <small>{m.snippet}</small>
                    </div>
                    <small className="time">{m.age}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="dark-panel">
            <header className="panel-head">
              <h3>Forum Activity</h3>
              <Link to="/forum">View All</Link>
            </header>

            {threads.length === 0 ? (
              <p className="empty-note">No threads yet.</p>
            ) : (
              <ul className="forum-list">
                {threads.map((t) => (
                  <li key={t.id}>
                    <span className="avatar-sm tag">🎵</span>
                    <div className="thread-meta">
                      <strong>{t.title}</strong>
                      <small>{t.snippet}</small>
                    </div>
                    <small className="replies">
                      {t.replies} replies · {t.age}
                    </small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </>
  );
}