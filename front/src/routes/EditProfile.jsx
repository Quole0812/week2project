import React from "react";
import { Link, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditSongTemplate from '../components/EditSongTemplate'
import EditArtistTemplate from '../components/EditArtistTemplate'
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";

import "../styles/Profile.css"

function EditProfile() {
  const { id } = useParams();
  const { user, login, logout, loading } = useContext(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [songSearchBool, setSongSearchBool] = useState(false);
  const [artistSearchBool, setArtistSearchBool] = useState(false);

  const [bio, setBio] = useState("");
  const [searchArtistRes, setSearchArtistRes] = useState({ items: [] });
  const [searchSongRes, setSearchSongRes] = useState({ items: [] });

  const [searchArtist, setSearchArtist] = useState("");
  const [searchSong, setSearchSong] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`http://127.0.0.1:3001/profile/${id}`);
        const userJson = await userRes.json();
        setUserData(userJson);
        setBio(userJson.bio)

        if (userJson.displayedArtists) {
          const artistsRes = await fetch("http://127.0.0.1:3001/profile/artists", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              artistIds: userJson.displayedArtists
            }),
          });
          const artistsJson = await artistsRes.json();
          setArtists(artistsJson.artists);
        }

        if (userJson.displayedSongs) {
          const songsRes = await fetch("http://127.0.0.1:3001/profile/songs", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              songsIds: userJson.displayedSongs
            }),
          });
          const songsJson = await songsRes.json();
          setSongs(songsJson.tracks);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const searchSongs = async (searchSong) => {
    if (searchSong == "") {
        setSearchSongRes({ items: [] })
    } else {
        try {
            const songsRes = await fetch("http://127.0.0.1:3001/profile/search/songs", {
                method: "POST",
                credentials: "include",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                query: searchSong,
                offset: 0
                }),
            });
            const songsJson = await songsRes.json();
            setSearchSongRes(songsJson.tracks);
            setSongSearchBool(true);
        } catch (err) {
            console.error("Error fetching song search: ", err);
        }
    }
  }

  const searchArtists = async (searchArtist) => {
    if (searchArtist == "") {
        setSearchArtistRes({ items: [] })
    } else {
        try {
            const artistRes = await fetch("http://127.0.0.1:3001/profile/search/artist", {
                method: "POST",
                credentials: "include",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                query: searchArtist,
                offset: 0
                }),
            });
            const artistJson = await artistRes.json();
            setSearchArtistRes(artistJson.artists)
            setArtistSearchBool(true);
        } catch (err) {
            console.error("Error fetching artist search: ", err);
        }
    }   
  }

  if (loading || pageLoading) {
    return (
      <div className="loadingPage"></div>
    )
  } else {
    return (
      <>
        <Sidebar/>
        <div className="main-content">
          {user ? (
            <div className="profileOffset">
              <div className="profileHeader">
                <img src={userData.profile_picture} className="profilePicture"/>
                <div>
                  <div className="editProfileText">
                    EDIT PROFILE
                  </div>
                  <div className="profileHeaderText">
                    <div className="profileUsernameText">
                      @{userData.name}
                    </div>
                    {id === user.id ? (
                      <Link className="profileEditLink" to={`/profile/${id}`}>
                        <button className="profileSaveButton">Save</button>
                      </Link>
                      ) : (
                        <></>
                      )
                    }
                  </div>
                </div>
              </div>
              <div className="bioContainer">
                <div className="bioHeaderText">Bio</div>
                <input className="bioEditTextField" type="text" value={bio} placeholder="Bio" onChange={(e) => setBio(e.target.value)}/>
              </div>
              <div className="artistsContainer">
                <div className="artistsHeaderText">Displayed Artists</div>
                <div className="displayedArtistsContainer">
                    {artists.length > 0 ? (artists.map((artist) => (
                      <EditArtistTemplate key={artist.id} artistObj={artist} />
                    ))) : (
                      <div className="noContent"> No artists to display </div>
                    )}
                </div>
                <div className="searchContainer">
                    <input className="artistSearch" type="text" placeholder="Search for an artist" onChange={(e) => setSearchArtist(e.target.value)} />
                    <button className="editSearch" onClick={() => searchArtists(searchArtist)}><SearchOutlinedIcon/></button>
                </div>
                <div className="displayedSongsContainer">
                    {searchArtistRes.items.length > 0 ? (searchArtistRes.items.map((artist) => (
                        <EditArtistTemplate key={artist.id} artistObj={artist} />
                    ))) : (
                      artistSearchBool ? (
                        <div className="noContent"> No search results </div>
                      ) : (
                        <></>
                      )
                    )}
                </div>
              </div>
              <div className="songsContainer">
                <div className="songsHeaderText">Displayed Songs</div>
                <div className="displayedArtistsContainer">
                    {songs.length > 0 ? (songs.map((song) => (
                        <EditSongTemplate key={song.id} songObj={song} />
                    ))) : (
                      <div className="noContent"> No artists to display </div>
                    )}
                </div>
                <div className="searchContainer">
                    <input className="songSearch" type="text" placeholder="Search for a song" onChange={(e) => setSearchSong(e.target.value)} />
                    <button className="editSearch" onClick={() => searchSongs(searchSong)}><SearchOutlinedIcon/></button>
                </div>
                <div className="displayedSongsContainer">
                    {searchSongRes.items.length > 0 ? (searchSongRes.items.map((song) => (
                        <EditSongTemplate key={song.id} songObj={song} />
                    ))) : (
                      songSearchBool ? (
                        <div className="noContent"> No search results </div>
                      ) : (
                        <></>
                      )
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div>Must sign in to view this page.</div>
          )}
        </div>
      </>
    )
  }
}

export default EditProfile;