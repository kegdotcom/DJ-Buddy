import React, { useState } from "react";
import { Song, SearchResult, Artist } from "../SpotifyInterfaces";
import SongPreview from "../components/song/SongPreview";
import ArtistPreview from "../components/artist/ArtistPreview";
import { Link } from "react-router-dom";

export default function Wrapped() {
  const [songList, setSongList] = useState<Song[]>([]);
  const [artistList, setArtistList] = useState<Artist[]>([]);
  const [songSelected, setSongSelected] = useState<boolean>(true);

  const spotifyToken = sessionStorage.getItem("spotify-access-token");

  async function getTopSongs() {
    setSongSelected(true);
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?" +
        new URLSearchParams({
          limit: "50",
        }),
      {
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Error getting the user's top items: ${response.statusText}`
      );
      return (
        <h3>
          Sorry! Something went wrong. Please make sure your Spotify account is
          connected and try again.
        </h3>
      );
    }

    const searchResult: SearchResult = await response.json();
    const topSongs: Song[] = searchResult.items;
    setSongList(topSongs);
  }

  async function getTopArtists() {
    setSongSelected(false);
    const response = await fetch("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });

    if (!response.ok) {
      console.error(`Error getting top artists: ${response.statusText}`);
      return (
        <h3>
          Sorry! Something went wrong. Please make sure your Spotify account is
          connected and try again.
        </h3>
      );
    }

    const searchResult = await response.json();
    const topArtists: Artist[] = searchResult.items;
    setArtistList(topArtists);
  }

  const buttonStyle = {
    backgroundColor: "#031d44",
    display: "inline-block",
    color: "#72788d",
    borderRadius: "5px",
  };

  return (
    <>
      <h1>Wrapped</h1>
      {!spotifyToken && <Link to="/login">Connect To Spotify!</Link>}
      <h3>Find your top songs or artists from the last 6 months!</h3>
      <button style={buttonStyle} onClick={getTopSongs}>
        Show my top songs!
      </button>
      <button style={buttonStyle} onClick={getTopArtists}>
        Show my top artists!
      </button>
      <div>
        {songSelected ? (
          <ul style={{ listStyleType: "none" }}>
            {songList.map((song) => {
              return <SongPreview song={song} />;
            })}
          </ul>
        ) : (
          <ul style={{ listStyleType: "none" }}>
            {artistList.map((artist) => {
              return <ArtistPreview artist={artist} />;
            })}
          </ul>
        )}
      </div>
    </>
  );
}
