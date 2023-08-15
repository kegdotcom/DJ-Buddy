import React, { useState } from "react";
import { Buffer } from "buffer";
import {
  useSpotifyToken,
  useUpdateSpotifyToken,
} from "../context/SpotifyTokenContext";

export default function Connect() {
  const spotifyToken = useSpotifyToken();
  const updateSpotifyToken = useUpdateSpotifyToken();

  const clientID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  const redirectURI = "http://localhost:3000/connect";

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const authCode = params.get("code");

  try {
    const response = fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(clientID + ":" + clientSecret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectURI}`,
    })
      .then((res) => res.json())
      .then((data) => {
        window.alert(JSON.stringify(data));
        updateSpotifyToken(data.access_token);
      });
  } catch (err) {
    console.error(`Error getting token from code: ${err}`);
    return <h1>Sorry! Something went wrong! Please try that again.</h1>;
  }

  return (
    <>
      <h1>Connected!</h1>
      <p>access token: {spotifyToken}</p>
    </>
  );
}
