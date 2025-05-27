import React from "react";
import { Link, useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from '../components/Sidebar/Sidebar.jsx';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3001/profile/${id}`);
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || pageLoading) {
    return (
      <></>
    )
  } else {
    if(!user) {
      return(
        <>
          <Sidebar/>
          <div className="main-content">
            Must sign in to view this page.
          </div>
        </>
      )
    } else {
      return (
        <>
          <Sidebar/>
          <div className="main-content">
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
                      <Link className="profileEditLink" to="/">
                        <button className="profileEditButton">Edit</button>
                      </Link>
                      ) : (
                        <></>
                      )
                    }
                  </div>
                  <div className="profileBio">
                    {userData.bio}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
    }
  }  
}

export default Profile;
