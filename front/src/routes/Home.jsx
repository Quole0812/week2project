import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from "../components/Sidebar/Sidebar";
import "../styles/Home.css";

export default function Home() {
  const { user, login, loading } = useContext(AuthContext);

  const [topArtists, setTopArtists] = useState([]);
  const [topSongs,   setTopSongs]   = useState([]);

}