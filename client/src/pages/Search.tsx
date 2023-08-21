import React, { useState } from "react";
import Prompter from "../components/prompter/Prompter";
import { Link } from "react-router-dom";
import { SearchResult, Playlist, Song, SavedSong } from "../SpotifyInterfaces";

export default function Search() {
  const [data, setData] = useState<string[]>();

  const spotifyAccessToken = sessionStorage.getItem("spotify-access-token");

  async function getPlaylists() {
    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });
    const playlistsJSON = await response.json();
    let playlists = playlistsJSON.items;
    playlists = playlists.map((playlist: Playlist) => {
      return playlist.name;
    });
    setData(playlists);
  }

  async function getSavedTracks() {
    const response = await fetch("https://api.spotify.com/v1/me/tracks", {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });
    const tracksJSON = await response.json();
    let tracks = tracksJSON.items;
    tracks = tracks.map((savedTrack: SavedSong) => {
      return savedTrack.track.name;
    });
    setData(tracks);
  }

  return (
    <>
      <h1>Search for Songs | </h1>
      {!spotifyAccessToken && <Link to="/login">Connect To Spotify!</Link>}
      <button onClick={getPlaylists}>Get Playlists</button>
      <button onClick={getSavedTracks}>Get Saved Tracks</button>
      <ol>
        {data?.map((item) => {
          return <li>{item}</li>;
        })}
      </ol>
      <Prompter />
    </>
  );
}
