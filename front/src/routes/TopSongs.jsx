import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from "../components/Sidebar/Sidebar";
import TopSongsHeader from "../components/TopSongs/TopSongsHeader";
import TopSongsGrid from "../components/TopSongs/TopSongsGrid.jsx";
import TopSongsList from "../components/TopSongs/TopSongsList";
import axios from "axios";
import "../styles/TopSongs.css";

const TopSongs = () => {
  const { user, loading } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [timeRange, setTimeRange] = useState("medium_term");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeRangeLabels = {
    short_term: "Last month",
    medium_term: "Last year",
    long_term: "All time"
  };

  useEffect(() => {
    const fetchTopSongs = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://127.0.0.1:3001/api/top-songs?time_range=${timeRange}`,
          { withCredentials: true }
        );
        setSongs(response.data.items);
      } catch (err) {
        setError("Failed to fetch top songs. Please try again.");
        console.error("Error fetching top songs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopSongs();
  }, [user, timeRange]);

  return (
    <div className="top-songs-page">
      <Sidebar />
      <div className="top-songs-main">
        <TopSongsHeader
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          timeRangeLabels={timeRangeLabels}
        />
        {loading || isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your top songs...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        ) : !user ? (
          <div className="not-logged-in">
            <h2>Please log in to view your top songs</h2>
            <p>You need to be logged in with Spotify to see your top songs.</p>
          </div>
        ) : (
          <>
            <TopSongsGrid songs={songs.slice(0, 3)} />
            <TopSongsList songs={songs.slice(3)} />
          </>
        )}
      </div>
    </div>
  );
};

export default TopSongs;