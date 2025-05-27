import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import axios from "axios";
import "../styles/TopArtists.css";
import Sidebar from '../components/Sidebar/Sidebar';

const TopArtists = () => {
  const { user, loading } = useContext(AuthContext);
  const [artists, setArtists] = useState([]);
  const [timeRange, setTimeRange] = useState("medium_term");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const timeRangeLabels = {
    short_term: "Last Month",
    medium_term: "Last Year",
    long_term: "All Time"
  };

  useEffect(() => {
    const fetchTopArtists = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://127.0.0.1:3001/api/top-artists?time_range=${timeRange}`, {withCredentials: true});
        setArtists(response.data.items);
      } catch (err) {
        setError("Failed to fetch top artists. Please try again.");
        console.error("Error fetching top artists:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopArtists();
  }, [user, timeRange]);

  if (loading || isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your top artists...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="not-logged-in">
        <h2>Please log in to view your top artists</h2>
        <p>You need to be logged in with Spotify to see your top artists.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="top-artists-container" style={{ marginLeft: 240, width: "100%" }}>
        <div className="time-range-selector">
          <h2>Your Top Artists</h2>
          <div className="time-range-buttons">
            {Object.entries(timeRangeLabels).map(([value, label]) => (
              <button
                key={value}
                className={`time-range-button ${timeRange === value ? 'active' : ''}`}
                onClick={() => setTimeRange(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="artists-grid">
          {artists.map((artist) => (
            <div key={artist.id} className="artist-card">
              <img
                src={artist.images[0]?.url || 'default-artist-image.png'}
                alt={artist.name}
                className="artist-image"
              />
              <h3 className="artist-name">{artist.name}</h3>
              <p className="artist-genres">
                {artist.genres.slice(0, 2).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopArtists; 