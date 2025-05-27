import React from "react";
import { useParams } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import Sidebar from '../components/Sidebar/Sidebar.jsx';

function Profile() {
  const { id } = useParams();
  const { user, login, logout, loading } = useContext(AuthContext);
  if (!user) {
    return (
      <>
        <Sidebar/>
        <button onClick={() => login()}>login</button>
      </>
    );
  } else {
    return (
      <>
        <Sidebar/>
        <button onClick={() => logout()}>logout</button>
      </>
    )
  }
  
}

export default Profile;
