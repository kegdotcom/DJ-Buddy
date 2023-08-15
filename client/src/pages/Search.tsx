import React from "react";
import Prompter from "../components/prompter/Prompter";
import QueryString from "querystring";
import { useUpdateSpotifyToken } from "../context/SpotifyTokenContext";

export default function Search() {
  const updateSpotifyToken = useUpdateSpotifyToken();

  const clientID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  const redirectURI = "http://localhost:3000/connect";
  const authScopes =
    "user-read-currently-playing playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-public user-top-read user-library-modify user-library-read";

  const generateRandomString = function (length: number): string {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const state = generateRandomString(16);

  const authParams = QueryString.stringify({
    client_id: clientID,
    response_type: "code",
    redirect_uri: redirectURI,
    scope: authScopes,
    state: state,
  });

  // this link will send the user to spotify to authorize the application, and then back to the localhost:3000/connect page
  // upon arrival, the browser will have an authorization code in the URL bar that we can exchange for an Access Token
  const authorizationLink = `https://accounts.spotify.com/authorize?${authParams}`;

  return (
    <>
      <h1>
        Search for Songs |{" "}
        <span style={{ backgroundColor: "#009911", color: "#222222" }}>
          <a href={authorizationLink}>Connect to Spotify</a>
        </span>
      </h1>
      <Prompter />
    </>
  );
}
