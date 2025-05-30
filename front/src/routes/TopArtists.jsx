import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from "../components/Sidebar/Sidebar";
import TopArtistsHeader from "../components/TopArtists/TopArtistsHeader";
import TopArtistsGrid from "../components/TopArtists/TopArtistsGrid";
import TopArtistsList from "../components/TopArtists/TopArtistsList";
import axios from "axios";
import "../styles/TopArtists.css";
import { useNavigate } from "react-router-dom";


const TopArtists = () => {
  const { user, loading } = useContext(AuthContext);
  const [artists, setArtists] = useState([]);
  const [timeRange, setTimeRange] = useState("medium_term");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
        if (!loading && !user) {
            navigate('/home');
        }
    }, [user, loading, navigate]);

  const timeRangeLabels = {
    short_term: "Last month",
    medium_term: "Last year",
    long_term: "All time"
  };

  useEffect(() => {
    const fetchTopArtists = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://127.0.0.1:3001/api/top-artists?time_range=${timeRange}`,
          { withCredentials: true }
        );
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

  return (
    <div className="top-artists-page">
      <Sidebar />
      <div className="top-artists-main">
        <TopArtistsHeader
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          timeRangeLabels={timeRangeLabels}
        />
        {loading || isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your top artists...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        ) : !user ? (
          <div className="not-logged-in">
            <h2>Please log in to view your top artists</h2>
            <p>You need to be logged in with Spotify to see your top artists.</p>
          </div>
        ) : (
          <>
            <TopArtistsGrid artists={artists.slice(0, 3)} />
            <TopArtistsList artists={artists.slice(3)} />
          </>
        )}
      </div>
    </div>
  );
};

export default TopArtists; 