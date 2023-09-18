import React from "react";
import QueryString from "querystring";
import styles from "./styles/general.module.css";

export default function Login() {
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
    <div className={styles.container}>
      <h1>Log In to Spotify</h1>
      <h3>
        <a href={authorizationLink}>Connect to Spotify</a>
      </h3>
      <p>
        Having trouble using DJ Buddy? The Spotify connection only lasts for one
        hour, so maybe try to reconnect!
      </p>
    </div>
  );
}
