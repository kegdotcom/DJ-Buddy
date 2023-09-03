import React from "react";
import Generator from "../components/generator/Generator";
import { Link } from "react-router-dom";

export default function Search() {
  const spotifyAccessToken = sessionStorage.getItem("spotify-access-token");

  return (
    <>
      <h1>Search for Songs</h1>
      {!spotifyAccessToken && <Link to="/login">Connect To Spotify!</Link>}
      <Generator />
    </>
  );
}
