import React from "react";
import "../../styles/TopArtists.css";

const TopArtistsList = ({ artists }) => {
  return (
    <div className="top-artists-list">
      {artists.map((artist, idx) => (
        <div key={artist.id} className="artist-list-item">
          <div className="artist-list-rank">{idx + 4}</div>
          <div className="artist-list-image-container">
            <img
              src={artist.images[0]?.url || "default-artist-image.png"}
              alt={artist.name}
              className="artist-list-image"
            />
          </div>
          <div className="artist-list-info">
            <div className="artist-list-name">{artist.name}</div>
            <div className="artist-list-plays">
              {artist.playcount ? `${artist.playcount} plays` : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopArtistsList;