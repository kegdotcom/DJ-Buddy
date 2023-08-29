import React, { FormEvent, useRef, useState } from "react";
import useSettings from "../../context/SettingsContext";
import { Song, Playlist, SearchResult } from "../../SpotifyInterfaces";
import SongPreview from "../song/SongPreview";
import styles from "./generator.module.css";

export default function Generator() {
  // load the user's settings from the settings context, Spotify access token from session storage, and OpenAI access token from environment variables
  const settings = useSettings();
  const spotifyToken = sessionStorage.getItem("spotify-access-token");
  const openAIToken = process.env.REACT_APP_OPENAI_API_KEY;

  // create a state hook to store list of songs found for the playlist
  const [songList, setSongList] = useState<Song[]>([]);

  // ---------- REQUEST FORM LOGIC ----------
  // ref hooks for the input fields
  const reqNumRef = useRef<HTMLInputElement>(null!);
  const reqDesireRef = useRef<HTMLInputElement>(null!);

  // function to handle submission of the request form
  async function handleRequestSubmit(ev: FormEvent) {
    // stop the page from redirecting
    ev.preventDefault();

    // send a POST request to the OpenAI API to get songs that match the desired emotion
    const openAIResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIToken}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You recommend music to users by responding with a TRIPPLE-comma seperated list of songs, formatted as SONG NAME---SONG ARTIST`,
            },
            {
              role: "user",
              content: `What are ${reqNumRef.current.value} songs that a ${settings.age} year old ${settings.gender} would like that fit the feeling of ${reqDesireRef.current.value}? Do not try to make any remarks, conversation, or include extra text or numbering in your response. Format the response as a TRIPPLE-comma seperated list of songs, formatted as """SONG NAME---SONG ARTIST""". For example, a proper response could look like Hello---Adele,,,Radioactive---Imagine Dragons,,,Circles---Post Malone`,
            },
          ],
          temperature: settings.temperature,
        }),
      }
    );
    const responseJSON = await openAIResponse.json();

    // store the final output from the OpenAI API
    const gptResponse: string = responseJSON.choices[0].message.content;

    // TESTING PURPOSES ONLY VVV
    window.alert(gptResponse);
    // TESTING PURPOSES ONLY ^^^

    // process the OpenAI API output into a list of JSON objects, and then searches spotify for them
    interface ResSong {
      name: string;
      artist: string;
    }
    // split the response into NAME---ARTIST strings
    const pairs: string[] = gptResponse.split(",,,");

    // iterate through the NAME---ARTIST strings and attempt to convert them to Song objects from Spotify
    let songs: Song[] = [];
    for (let i = 0; i < pairs.length; i++) {
      // for each NAME---ARTIST stirng, split at the --- and create a ResSong object with its data
      const pair: string = pairs[i];
      const parts: string[] = pair.split("---");
      const current: ResSong = {
        name: parts[0],
        artist: parts[1],
      };

      // for each ResSong, make a GET request to the Spotify API to search for the song it represents
      const searchResponse = await fetch(
        "https://api.spotify.com/v1/search?" +
          new URLSearchParams({
            q: encodeURIComponent(
              `track:${current.name} artist:${current.artist}`
            ),
            type: "track",
            limit: "1",
          }),
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );

      if (!searchResponse.ok) {
        console.error(
          `Error searching Spotify for song ${i}: ${searchResponse.statusText}`
        );
        continue;
      }

      const searchJSON = await searchResponse.json();
      const searchResult: SearchResult = searchJSON.tracks;
      let song: Song;
      try {
        song = searchResult.items[0];
      } catch (err) {
        console.error(
          `Error getting the Song object from the Spotify API search result: ${err}`
        );
        continue;
      }
      setSongList((prev) => {
        const newSong: Song[] = [song];
        return prev.concat(newSong);
      });
    }
  }
  // ---------- REQUEST FORM LOGIC ----------

  // ---------- CONFIRMATION FORM LOGIC ----------
  // ref hooks for input values
  const confirmationNameRef = useRef<HTMLInputElement>(null!);
  const confirmationDescRef = useRef<HTMLInputElement>(null!);

  // function to handle submission of the confirmation form
  async function handleConfirmationSubmit(ev: FormEvent) {
    // prevent the page from redirecting
    ev.preventDefault();

    window.alert(songList.length);

    // create a new playlist in the user's spotify account
    // first, get the user's Spotify ID by making a GET request to the Spotify API
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });

    // make sure the user is connected properly
    if (!userResponse.ok) {
      console.error(
        `Error getting current user's profile: ${userResponse.statusText}`
      );
      return (
        <h1>
          Something went wrong! Try to reconnect your Spotify account. Visit
          Login above
        </h1>
      );
    }

    // convert the response promise to a json object
    const userJSON = await userResponse.json();

    // store the current user's Spotify ID
    const userID = userJSON.id;

    // use that Spotify ID to make POST request to the Spotify API to create a new playlist in the user's account with the data from the confirmation form
    const playlistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userID}/playlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyToken}`,
        },
        body: JSON.stringify({
          name: confirmationNameRef.current.value,
          description: confirmationDescRef.current.value,
        }),
      }
    );

    // make sure the playlist was created successfully
    if (!playlistResponse.ok) {
      console.error(
        `Error creating new playlist: ${playlistResponse.statusText}`
      );
      return (
        <h1>
          Something went wrong creating the playlist! Please make sure your
          Spotify account is connected and try again
        </h1>
      );
    }

    // convert the response promise to a json object
    const playlistJSON = await playlistResponse.json();

    // get the new Playlist object
    let newPlaylist: Playlist;
    try {
      newPlaylist = playlistJSON;
    } catch (err) {
      console.error(`Error getting new playlist's data: ${err}`);
      return (
        <h1>
          Sorry! Something went wrong. Please make sure your Spotify account is
          connected and try again.
        </h1>
      );
    }

    // store the new playlist's Spotify ID
    const playlistID: string = newPlaylist.id;

    // get all the URIs of the songs to populate the new playlist with
    const songURIs: string[] = songList.map((song) => {
      return song.uri;
    });

    // now populate the new playlist with songs by making a POST request to the Spotify API
    const populationResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyToken}`,
        },
        body: JSON.stringify({
          uris: songURIs,
        }),
      }
    );

    if (!populationResponse.ok) {
      console.error(
        `Error adding songs to playlist: ${populationResponse.statusText}`
      );
      return (
        <h1>
          Sorry! There was an error adding songs to the playlist --{" "}
          {populationResponse.statusText} -- Please try again.
        </h1>
      );
    }

    const populationJSON = await populationResponse.json();
    window.alert(`Success! Snapshot ID: ${populationJSON.snapshot_id}`);
  }
  // ---------- CONFIRMATION FORM LOGIC ----------

  return (
    <>
      <h1>Generate a Playlist</h1>
      <form key="request-form" onSubmit={handleRequestSubmit}>
        {/* number of songs */}
        <span>Find me </span>
        <input
          type="number"
          min="1"
          max="50"
          placeholder="Number of Songs"
          defaultValue={1}
          ref={reqNumRef}
        />
        {/* description of songs */}
        <span> songs that fit the feeling of </span>
        <input
          type="text"
          placeholder="Description of Songs"
          ref={reqDesireRef}
        />
        <input type="submit" value="Generate" />
      </form>
      <br />
      <div className={styles.songListGroup}>
        <ul className={styles.songList}>
          {songList.map((song) => {
            return <SongPreview song={song} />;
          })}
        </ul>
      </div>
      <br />
      <span>
        Happy with the songs above?
        <br />
        Choose a playlist name and description and confirm to add this playlist
        to your Spotify account!
      </span>
      <form key="confirmation-form" onSubmit={handleConfirmationSubmit}>
        {/* playlist name */}
        <input
          type="text"
          placeholder="New Playlist Name"
          ref={confirmationNameRef}
        />
        {/* playlist description */}
        <input
          type="text"
          placeholder="New Playlist Description"
          ref={confirmationDescRef}
        />
        <input type="submit" value="Confirm" />
      </form>
    </>
  );
}
