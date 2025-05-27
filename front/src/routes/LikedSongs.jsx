import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/LikedSongs.css";

export default function LikedSongs() {
  const { user, login, loading } = useContext(AuthContext);

  const [tracks, setTracks] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total,  setTotal]  = useState(0);
  const [busy,   setBusy]   = useState(false);

  const fetchBatch = () => {
    if (busy) return;
    setBusy(true);

    fetch(`http://127.0.0.1:3001/api/liked-songs?limit=50&offset=${offset}`, {
      credentials: "include",
    })
    .then(async r => {        
        if (!r.ok) throw r;
        return r.json();
    })
      .then(({ tracks: newT, nextOffset, total }) => {
        setTracks(prev => [...prev, ...newT]);
        setOffset(nextOffset);
        setTotal(total);
      })
      .catch(console.error)
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (user) fetchBatch();
  }, [user]);

  if (!user && !loading) {
    return <button onClick={login}>Login with Spotify</button>;
  }

  return (
    <main className="liked-page">
        <Sidebar></Sidebar>
      <h1>Your Liked Songs</h1>

      <div className="grid">
        {tracks.map(t => (
          <article key={t.id} className="card">
            <img src={t.albumArt} alt="" />
            <h2>{t.name}</h2>
            <p>{t.artists}</p>
            {t.preview && <audio controls src={t.preview} />}
          </article>
        ))}
      </div>

      {tracks.length < total && (
        <button
          className="more-btn"
          disabled={busy}
          onClick={fetchBatch}
        >
          {busy ? "Loading…" : "Load more"}
        </button>
      )}
    </main>
  );
}