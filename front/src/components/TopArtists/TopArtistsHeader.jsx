import React from "react";
import "../../styles/TopArtists.css";

const TopArtistsHeader = ({ timeRange, setTimeRange, timeRangeLabels }) => (
  <div className="top-artists-header">
    <div>
      <h2 className="top-artists-title">Your Top Artists</h2>
      <p className="top-artists-subtitle">Based on your listening activity</p>
    </div>
    <div className="time-range-buttons">
      {Object.entries(timeRangeLabels).map(([value, label]) => (
        <button
          key={value}
          className={`time-range-button${timeRange === value ? " active" : ""}`}
          onClick={() => setTimeRange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

export default TopArtistsHeader;
