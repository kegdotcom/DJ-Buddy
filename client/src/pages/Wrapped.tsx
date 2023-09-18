import React, { useState } from "react";
import { Song, SearchResult, Artist } from "../SpotifyInterfaces";
import SongPreview from "../components/song/SongPreview";
import ArtistPreview from "../components/artist/ArtistPreview";
import { Link } from "react-router-dom";
import styles from "./styles/wrapped.module.css";

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

  return (
    <div className={styles.container}>
      <h1>Wrapped</h1>
      {!spotifyToken && <Link to="/login">Connect To Spotify!</Link>}
      <h3>Find your top songs or artists from the last 6 months!</h3>
      <button className={styles.wrappedButton} onClick={getTopSongs}>
        Show my top songs!
      </button>
      <button className={styles.wrappedButton} onClick={getTopArtists}>
        Show my top artists!
      </button>
      <div className={styles.listContainer}>
        {songSelected ? (
          <ul className={styles.list}>
            {songList.map((song, index) => {
              return <SongPreview song={song} index={index} />;
            })}
          </ul>
        ) : (
          <ul className={styles.list}>
            {artistList.map((artist, index) => {
              return <ArtistPreview artist={artist} index={index} />;
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
