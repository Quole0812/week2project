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
}