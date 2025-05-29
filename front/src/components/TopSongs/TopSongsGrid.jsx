import React from "react";
import "../../styles/TopSongs.css";

const TopSongsGrid = ({ songs }) => {
  // Pad to always have 3 items for layout
  const padded = [
    songs && songs[1] ? songs[1] : null,
    songs && songs[0] ? songs[0] : null,
    songs && songs[2] ? songs[2] : null
  ];

  if (!Array.isArray(songs) || songs.length === 0) {
    return <div className="top-songs-grid-empty">No top songs found.</div>;
  }

  return (
    <div className="top-songs-grid">
      {padded.map((song, idx) =>
        song ? (
          <div
            key={song.id}
            className={`song-grid-card trophy-${["second", "first", "third"][idx]}`}
            style={{ animationDelay: `${idx * 0.15 + 0.2}s` }}
          >
            <div className="song-star-row">
              <span className={`star ${idx === 1 ? "star-accent" : "star-secondary"}`}>
                ★
              </span>
            </div>
            <div className="song-grid-image-container">
              <img
                src={
                  song.album && song.album.images && song.album.images.length > 0 && song.album.images[0].url
                    ? song.album.images[0].url
                    : "default-song-image.png"
                }
                alt={song.name}
                className="song-grid-image"
              />
            </div>
            <div className="song-grid-bottom">
              <div className="song-grid-name">{song.name}</div>
              <div className="song-grid-title">{song.artists[0]?.name || "Unknown"}</div>
            </div>
          </div>
        ) : (
          <div
            key={idx}
            className={`song-grid-card trophy-${["second", "first", "third"][idx]} empty`}
            style={{ animationDelay: `${idx * 0.15 + 0.2}s` }}
          />
        )
      )}
    </div>
  );
};

export default TopSongsGrid;