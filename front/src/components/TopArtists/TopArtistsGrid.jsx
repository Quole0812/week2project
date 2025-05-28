import React from "react";
import "../../styles/TopArtists.css";

const TopArtistsGrid = ({ artists }) => {
  // Pad the array to always have 3 items for consistent layout
  const padded = [artists[1], artists[0], artists[2]]; // [2nd, 1st, 3rd]
  return (
    <div className="top-artists-grid">
      {padded.map((artist, idx) =>
        artist ? (
          <div
            key={artist.id}
            className={`artist-grid-card trophy-${["second", "first", "third"][idx]}`}
          >
            <div className="artist-star-row">
              <span className={`star ${idx === 1 ? "star-accent" : "star-secondary"}`}>
              ★
              </span>
            </div>
            <div className="artist-grid-image-container">
              <img
                src={artist.images[0]?.url || "default-artist-image.png"}
                alt={artist.name}
                className="artist-grid-image"
              />
            </div>
            <div className="artist-grid-name">{artist.name}</div>
            <div className="artist-grid-plays">
              {artist.playcount ? `${artist.playcount} plays` : ""}
            </div>
          </div>
        ) : (
          <div key={idx} className={`artist-grid-card trophy-${["second", "first", "third"][idx]} empty`} />
        )
      )}
    </div>
  );
};

export default TopArtistsGrid;