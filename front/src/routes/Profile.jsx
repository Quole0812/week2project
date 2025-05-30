import React from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import ArtistTemplate from "../components/ArtistTemplate";
import SongTemplate from "../components/SongTemplate";
import CircularProgress from '@mui/material/CircularProgress';
import "@fontsource/inter";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/800.css";

import "../styles/Profile.css"

function Profile() {
  const { id } = useParams();
  const { user, login, logout, loading } = useContext(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

   useEffect(() => {
        if (!loading && !user) {
            navigate('/home');
        }
    }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`http://127.0.0.1:3001/profile/${id}`);
        const userJson = await userRes.json();
        setUserData(userJson);

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
        console.error("Error fetching user data: ", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [id, location.search]);

  const messageUser = async () => {
    try {
      const chatRes = await fetch("http://127.0.0.1:3001/inbox/createChat", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1: id,
          user2: user.id
        }),
      })
      const chat = await chatRes.json();

      if (chatRes.ok && chat?.id) {
        window.location.href = `http://127.0.0.1:5173/inbox/${chat.id}`;
      } else {
        console.error("Failed to create chat: ", chat);
      }
    } catch (e) {
      console.error("Error creating chat: ", e);
    }
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
        <div className="main-content">
          {user ? (
            <div className="profileOffset">
              <div className="profileHeader">
                <img src={userData.profile_picture} className="profilePicture"/>
                <div>
                  <div className="profileProfileText">
                    PROFILE
                  </div>
                  <div className="profileHeaderText">
                    <div className="profileUsernameText">
                      @{userData.name}
                    </div>
                    {id === user.id ? (
                        <Link className="profileEditLink" to={`/editprofile/${id}`}>
                          <button className="profileEditButton">Edit</button>
                        </Link>
                      ) : (
                        <button className="profileEditButton" onClick={() => messageUser()}>Message</button>
                      )
                    }
                  </div>
                  <div className="profileBio">
                    {userData.bio}
                  </div>
                </div>
              </div>
              {userData.privateProfile && id !== user.id ? (
                <>
                  <div className="profileCenter">User is private.</div>
                </>
              ) : (
                <>
                  <div className="artistsContainer">
                    <div className="artistsHeaderText">Displayed Artists</div>
                    <div className="displayedArtistsContainer">
                        {artists && artists.length > 0 ? (artists.map((artist) => (
                          <ArtistTemplate key={artist.id} artistObj={artist} />
                        ))) : (
                          <div className="noContent"> No artists to display </div>
                        )}
                    </div>
                  </div>
                  <div className="songsContainer">
                    <div className="songsHeaderText">Displayed Songs</div>
                    <div className="displayedSongsContainer">
                        {songs && songs.length > 0 ? (songs.map((song) => (
                            <SongTemplate key={song.id} songObj={song} />
                        ))) : (
                          <div className="noContent"> No songs to display </div>
                        )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
              <div className="profileMustSignIn">Must sign in to view this page.</div>
          )}
        </div>
        <Sidebar/>
      </>
    )
  }
}

export default Profile;
