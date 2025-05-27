import React from "react";
import { useParams } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

function Profile() {
  const { id } = useParams();
  const { user, login, logout, loading } = useContext(AuthContext);
  if (!user) {
    return (
      <>
        <button onClick={() => login()}>login</button>
      </>
    );
  } else {
    return (
      <>
        <button onClick={() => logout()}>logout</button>
      </>
    )
  }
  
}

export default Profile;
