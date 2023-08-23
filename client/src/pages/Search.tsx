import React, { ReactNode, useState } from "react";
import Prompter from "../components/prompter/Prompter";
import { Link } from "react-router-dom";
import PlaylistNode from "../components/playlist/PlaylistNode";
import {
  SearchResult,
  Song,
  PlaylistSearchResult,
  Playlist,
  SavedSong,
  SearchSong,
} from "../SpotifyInterfaces";

export default function Search() {
  const spotifyAccessToken = sessionStorage.getItem("spotify-access-token");
  const [data, setData] = useState<ReactNode>();
  const [songURIdata, setSongURIdata] = useState<string>();

  async function getPlaylists() {
    let playlists: Playlist[] = [];
    let nextPageURL =
      "https://api.spotify.com/v1/me/playlists?" +
      new URLSearchParams({ limit: "50" });
    let hasNext = true;

    while (hasNext) {
      const response = await fetch(nextPageURL, {
        headers: {
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
      });

      if (!response.ok) {
        console.error(
          `Error getting paginated playlists: ${response.statusText}`
        );
      }

      const data: PlaylistSearchResult = await response.json();
      playlists = playlists.concat(data.items);
      if (data.next != null) {
        nextPageURL = data.next;
      } else {
        hasNext = false;
      }
    }

    setData(<PlaylistNode playlists={playlists} />);
  }

  async function getSongURIs(openAIResponse: string) {
    const responseSongs: string[] = openAIResponse.trim().split(",,");
    const filteredSongs = responseSongs.filter((song) => song.includes("::"));
    const parsedSongs: SearchSong[] = filteredSongs.map((song) => {
      const songParts = song.split("::");
      const parsedSong: SearchSong = {
        name: songParts[0],
        artist: songParts[1],
      };
      return parsedSong;
    });

    let songs: Song[] = [];
    for (let i = 0; i < parsedSongs.length; i++) {
      const currSong: SearchSong = parsedSongs[i];
      const response = await fetch(
        "https://api.spotify.com/v1/search?" +
          new URLSearchParams({
            q: encodeURIComponent(
              `track:${currSong.name} artist:${currSong.artist}`
            ),
            type: "track",
            limit: "1",
          }),
        {
          headers: {
            Authorization: `Bearer ${spotifyAccessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`Error fetching spotify song: ${response.statusText}`);
        continue;
      }

      const songJSON = await response.json();
      const searchResult: SearchResult = songJSON.tracks;
      const foundSong: Song = searchResult.items[0];
      songs.push(foundSong);
    }

    songs.forEach((song) => {
      window.alert(song.name);
    });
  }

  return (
    <>
      <h1>Search for Songs |</h1>
      {!spotifyAccessToken && <Link to="/login">Connect To Spotify!</Link>}
      <Prompter />
      <button onClick={getPlaylists}>Get Playlists</button>
      <button
        onClick={(e) =>
          getSongURIs(
            "Happy::Pharrell Williams,,Can't Stop the Feeling!::Justin Timberlake,,Uptown Funk::Mark Ronson ft. Bruno Mars,,I Gotta Feeling::The Black Eyed Peas,,Shut Up and Dance::Walk The Moon"
          )
        }
      >
        Get Song URIs
      </button>
      {data}
      {songURIdata}
    </>
  );
}
