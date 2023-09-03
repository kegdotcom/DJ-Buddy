import React, { useEffect } from "react";
import { Buffer } from "buffer";

export interface TokenData {
  accessToken: string;
  scope: string;
  refreshToken: string;
}

export default function Connect() {
  useEffect(() => {
    async function getSpotifyToken() {
      const clientID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
      const redirectURI = "http://localhost:3000/connect";

      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const authCode = params.get("code");

      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(clientID + ":" + clientSecret).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectURI}`,
        });

        if (!response.ok) {
          console.error(response.statusText);
          return;
        }

        const token = await response.json();
        sessionStorage.setItem("spotify-access-token", token.access_token);
        sessionStorage.setItem("spotify-refresh-token", token.refresh_token);
      } catch (err) {
        console.error(`Error getting token from code: ${err}`);
      }
    }

    getSpotifyToken();
  }, []);

  return <h1>Connected!</h1>;
}
