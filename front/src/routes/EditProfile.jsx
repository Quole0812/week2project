import React from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditSongTemplate from '../components/EditSongTemplate'
import EditArtistTemplate from '../components/EditArtistTemplate'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
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
  const [privateProfile, setPrivateProfile] = useState(false);
  const [searchArtistRes, setSearchArtistRes] = useState({ items: [] });
  const [searchSongRes, setSearchSongRes] = useState({ items: [] });

  const [artistOffset, setArtistOffset] = useState(0);
  const [songOffset, setSongOffset] = useState(0);

  const [searchArtist, setSearchArtist] = useState("");
  const [searchSong, setSearchSong] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        if (user.id !== id) {
            window.location.href = `http://127.0.0.1:5173/profile/${user.id}`
        }

        try {
            const userRes = await fetch(`http://127.0.0.1:3001/profile/${id}`);
            const userJson = await userRes.json();
            setUserData(userJson);
            setBio(userJson.bio)
            setPrivateProfile(userJson.privateProfile)

            if (userJson.displayedArtists.length > 0) {
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

            if (userJson.displayedSongs.length > 0) {
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
  }, [id, user]);

  const searchSongs = async (searchSong, offset = songOffset) => {
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
                offset: offset
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

  const searchArtists = async (searchArtist, offset = artistOffset) => {
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
                offset: offset
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

  const saveEdit = async () => {
    try {
        const res = await fetch("http://127.0.0.1:3001/profile/update", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                userData: {
                    bio: bio,
                    displayedArtists: userData.displayedArtists,
                    displayedSongs: userData.displayedSongs,
                    privateProfile: privateProfile
                }
            }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            console.error("Save failed:", errorData);
        }
        navigate(`/profile/${id}`);
    } catch (e) {
        console.error("Error saving edits: ", e);
    }
  }

    const addSong = (song) => {
        const updatedUserData = {
            ...userData,
            displayedSongs: [...userData.displayedSongs, song.id]
        };
        setUserData(updatedUserData);

        setSongs(prevSongs => [...prevSongs, song]);
    }

    const removeSong = (song) => {
        const updatedUserData = {
            ...userData,
            displayedSongs: userData.displayedSongs.filter(sid => sid !== song.id)
        };
        setUserData(updatedUserData);

        setSongs(prevSongs => prevSongs.filter(s => s.id !== song.id));
    };

    const addArtist = (artist) => {
        const updatedUserData = {
            ...userData,
            displayedArtists: [...userData.displayedArtists, artist.id]
        };
        setUserData(updatedUserData);

        setArtists(prevArtists => [...prevArtists, artist]);
    }

    const removeArtist = (artist) => {
        const updatedUserData = {
            ...userData,
            displayedArtists: userData.displayedArtists.filter(aid => aid !== artist.id)
        };
        setUserData(updatedUserData);

        setArtists(prevArtists => prevArtists.filter(a => a.id !== artist.id));
    }

    const loadMoreSongs = async (count = 10) => {
        const newOffset = Math.max(songOffset + count, 0);
        setSongOffset(newOffset);
        await searchSongs(searchSong, newOffset);
    };

    const loadMoreArtists = async (count = 10) => {
        const newOffset = Math.max(artistOffset + count, 0);
        setArtistOffset(newOffset);
        await searchArtists(searchArtist, newOffset);
    };

    const handlePrivateProfile = (event) => {
        setPrivateProfile(event.target.checked);
    }

  if (loading || pageLoading) {
    return (
        <>
            <Sidebar/>
            <div className="main-content">
                <div className="loadingCenter">
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size={40}
                        thickness={4}
                        sx={{
                        color: '#ddd',
                        }}
                        className="backgroundSpinner"
                    />
                    <CircularProgress
                        size={40}
                        thickness={4}
                        sx={{
                        color: '#e03e58',
                        }}
                        className="foregroundSpinner"
                    />
                </div>
            </div>
        </>
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
                    {/* <Link className="profileEditLink" to={`/profile/${id}?refresh=true`}> */}
                        <button className="profileSaveButton" onClick={() => saveEdit()}>Save</button>
                    {/* </Link> */}
                    <Link className="profileEditLink" to={`/profile/${id}`}>
                        <button className="profileEditButton">Cancel</button>
                    </Link>
                  </div>
                  <div className="profileBio">
                    {bio}
                  </div>
                </div>
              </div>
              <div className="bioContainer">
                <div className="bioHeaderText">Bio</div>
                <input className="bioEditTextField" type="text" value={bio} placeholder="Bio" onChange={(e) => setBio(e.target.value)}/>
              </div>
              <div className="privateProfileContainer">
                <div className="bioHeaderText">Private Profile</div>
                <Switch
                    checked={privateProfile}
                    onChange={handlePrivateProfile}
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#66b574',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#66b574',
                        },
                    }}
                />
              </div>
              <div className="artistsContainer">
                <div className="artistsHeaderText">Displayed Artists</div>
                <div className="displayedSongsContainer">
                    {artists && artists.length > 0 ? (artists.map((artist) => (
                        <button key={artist.id} className="editButtonAdd" onClick={() => removeArtist(artist)}>
                            <EditArtistTemplate artistObj={artist} />
                            <div className="removeIcon">
                                <RemoveCircleOutlineIcon sx={{ fontSize: 20 }}/>
                            </div>
                        </button>
                    ))) : (
                      <div className="noContent"> No artists to display </div>
                    )}
                </div>
                <div className="searchContainer">
                    <input className="artistSearch" type="text" placeholder="Search for an artist" onChange={(e) => setSearchArtist(e.target.value)} />
                    <button className="editSearch" onClick={() => {
                        setArtistOffset(0);
                        searchArtists(searchArtist, 0)
                    }}><SearchOutlinedIcon/></button>
                </div>
                <div className="displayedSongsContainer">
                    {searchArtistRes.items.length > 0 ? (searchArtistRes.items.filter(artist => !userData.displayedArtists.includes(artist.id)).map((artist) => (
                        <button key={artist.id} className="editButtonAdd" onClick={() => addArtist(artist)}>
                            <EditArtistTemplate artistObj={artist} />
                            <div className="addIcon">
                                <AddCircleOutlineIcon sx={{ fontSize: 20 }}/>
                            </div>
                        </button>
                    ))) : (
                      artistSearchBool ? (
                        <div className="noContent"> No search results </div>
                      ) : (
                        <></>
                      )
                    )}
                    {artistSearchBool ? (
                        <div className="nextPrevContainer">
                            <button className="prevButton" onClick={() => loadMoreArtists(-5)}>Previous</button>
                            <button className="nextButton" onClick={() => loadMoreArtists(5)}>Next</button>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
              </div>
              <div className="artistContainer">
                <div className="songsHeaderText">Displayed Songs</div>
                <div className="displayedSongsContainer">
                    {songs && songs.length > 0 ? (songs.map((song) => (
                        <button key={song.id} className="editButtonAdd" onClick={() => removeSong(song)}>
                            <EditSongTemplate songObj={song} />
                            <div className="removeIcon">
                                <RemoveCircleOutlineIcon sx={{ fontSize: 20 }}/>
                            </div>
                        </button>
                    ))) : (
                      <div className="noContent"> No songs to display </div>
                    )}
                </div>
                <div className="searchContainer">
                    <input className="songSearch" type="text" placeholder="Search for a song" onChange={(e) => setSearchSong(e.target.value)} />
                    <button className="editSearch" onClick={() => {
                        setSongOffset(0);
                        searchSongs(searchSong, 0)
                    }}><SearchOutlinedIcon/></button>
                </div>
                <div className="displayedSongsContainer">
                    {searchSongRes.items.length > 0 ? (searchSongRes.items.filter(song => !userData.displayedSongs.includes(song.id)).map((song) => (
                        <button key={song.id} className="editButtonAdd" onClick={() => addSong(song)}>
                            <EditSongTemplate songObj={song} />
                            <div className="addIcon">
                                <AddCircleOutlineIcon sx={{ fontSize: 20 }}/>
                            </div>
                        </button>
                    ))) : (
                      songSearchBool ? (
                        <div className="noContent"> No search results </div>
                      ) : (
                        <></>
                      )
                    )}
                    {songSearchBool ? (
                        <div className="nextPrevContainer">
                            <button className="prevButton" onClick={() => loadMoreSongs(-5)}>Previous</button>
                            <button className="nextButton" onClick={() => loadMoreSongs(5)}>Next</button>
                        </div>
                    ) : (
                        <></>
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