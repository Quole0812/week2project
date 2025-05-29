import React from "react";
import "../../styles/TopSongs.css";

const TopSongsHeader = ({ timeRange, setTimeRange, timeRangeLabels }) => (
  <div className="top-songs-header">
    <div>
      <h2 className="top-songs-title">Your Top Songs</h2>
      <p className="top-songs-subtitle">Your most played tracks</p>
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

export default TopSongsHeader;