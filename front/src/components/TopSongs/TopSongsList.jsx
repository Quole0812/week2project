import React from "react";
import "../../styles/TopSongs.css";

const TopSongsList = ({ songs }) => {
  return (
    <div className="top-songs-list-1">
      {songs.map((song, idx) => (
        <div key={song.id} className="song-list-item-1">
          <div className="song-list-rank-1">{idx + 4}</div>
          <div className="song-list-image-container-1">
            <img
              src={
                song.album && song.album.images && song.album.images.length > 0 && song.album.images[0].url
                  ? song.album.images[0].url
                  : "default-song-image.png"
              }
              alt={song.name}
              className="song-list-image"
            />
          </div>
          <div className="song-list-info-1">
            <div className="song-list-title">{song.name}</div>
            <div className="song-list-name">{song.artists[0]?.name || "Unknown"}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopSongsList;