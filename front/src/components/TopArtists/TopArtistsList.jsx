import React from "react";
import "../../styles/TopArtists.css";

const TopArtistsList = ({ artists }) => {
  return (
    <div className="top-artists-list-1">
      {artists.map((artist, idx) => (
        <div key={artist.id} className="artist-list-item-1">
          <div className="artist-list-rank-1">{idx + 4}</div>
          <div className="artist-list-image-container-1">
            <img
              src={artist.images[0]?.url || "default-artist-image.png"}
              alt={artist.name}
              className="artist-list-image"
            />
          </div>
          <div className="artist-list-info-1">
            <div className="artist-list-name-1">{artist.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopArtistsList;