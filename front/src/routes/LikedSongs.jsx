import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from "../components/Sidebar/Sidebar";
import Favorite from "@mui/icons-material/Favorite";
import "../styles/LikedSongs.css";

export default function LikedSongs() {
  const { user, login, loading } = useContext(AuthContext);

  const [tracks, setTracks] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total,  setTotal]  = useState(0);
  const [busy,   setBusy]   = useState(false);
  const [tab,    setTab]    = useState("recent");
  const [tab,    setTab]    = useState("recent");

  const fetchBatch = (batchOffset) => {
    if (busy) return;
    setBusy(true);

    fetch(
      `http://127.0.0.1:3001/api/liked-songs?limit=50&offset=${batchOffset}`,
      { credentials: "include" }
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(({ tracks: newT, nextOffset, total }) => {
        setTracks((prev) => [...prev, ...newT]);
        setTracks((prev) => [...prev, ...newT]);
        setOffset(nextOffset);
        setTotal(total);
      })
      .catch(console.error)
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (user) {
      setTracks([]);
      fetchBatch(0);
    }
  }, [user]);

  if (!user && !loading) return <button onClick={login}>Login with Spotify</button>;
  if (!user && !loading) return <button onClick={login}>Login with Spotify</button>;

  return (
    <>
      <Sidebar />
      <main className="liked-page">

        <header className="liked-head">
          <Favorite className="heart-icon" />
          <div>
            <h1>Your Liked Songs</h1>
            <span className="sub">{total} songs</span>
          </div>
        </header>
        
        <div className="grid">
          {tracks.map((t) => (
            <article key={t.id} className="card">
              <img src={t.albumArt} alt="" />
              <h2>{t.name}</h2>
              <p>{t.artists}</p>
            </article>
          ))}
        </div>

        {tracks.length < total && tab === "recent" && (
          <button className="more-btn" disabled={busy} onClick={() => fetchBatch(offset)}>
            {busy ? "Loading…" : "Load more"}
          </button>
        )}
      </main>
    </>
  );
}