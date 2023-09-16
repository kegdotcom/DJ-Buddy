import React, { FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useSettings from "../context/SettingsContext";
import { Song, Playlist, SearchResult } from "../SpotifyInterfaces";
import SongCard from "../components/song/SongCard";
import styles from "./styles/generator.module.css";

export default function Generator() {
  // load the user's settings from the settings context, Spotify access token from session storage, and OpenAI access token from environment variables
  const settings = useSettings();
  const [loading, setLoading] = useState<boolean>(false);
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

    setLoading(true);

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
          // messages are the prompts we send to the GPT model we specified
          messages: [
            {
              // system message tells the model what its purpose is
              role: "system",
              content: `You recommend music to users by responding with a TRIPPLE-comma seperated list of songs, formatted as SONG NAME---SONG ARTIST`,
            },
            {
              // user message represents the prompt the model is responding to
              role: "user",
              content: `What are ${reqNumRef.current.value} songs that a ${settings.age} year old ${settings.gender} would like that fit the feeling of ${reqDesireRef.current.value}? Do not try to make any remarks, conversation, or include extra text or numbering in your response. Format the response as a TRIPPLE-comma seperated list of songs, formatted as """SONG NAME---SONG ARTIST""". For example, a proper response could look like Hello---Adele,,,Radioactive---Imagine Dragons,,,Circles---Post Malone`,
            },
          ],
          // temperature defines the variability in the model's responses
          temperature: settings.temperature,
        }),
      }
    );
    // parse the response as a JSON object
    const responseJSON = await openAIResponse.json();

    // store the actual response output from the OpenAI API
    const gptResponse: string = responseJSON.choices[0].message.content;

    // TESTING PURPOSES ONLY VVV
    // window.alert(gptResponse);
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
      // split the song into two parts, the name of the song (parts[0]) and the artist (parts[1])
      const parts: string[] = pair.split("---");
      const current: ResSong = {
        name: parts[0],
        artist: parts[1],
      };

      // for each ResSong, make a GET request to the Spotify API to search for the song it represents
      // similar to the search bar in the Spotify app
      const searchResponse = await fetch(
        "https://api.spotify.com/v1/search?" +
          new URLSearchParams({
            // convert the ResSong object into URL search params that can be understood by the Spotify Web API
            q: encodeURIComponent(
              `track:${current.name} artist:${current.artist}`
            ),
            type: "track",
            // only return the first song that appears in the search
            limit: "1",
          }),
        {
          headers: {
            Authorization: `Bearer ${spotifyToken}`,
          },
        }
      );

      // check to make sure that the search returned a valid response
      if (!searchResponse.ok) {
        // if there was an error, print it to the console, and go to the next song on the list
        console.error(
          `Error searching Spotify for song ${i}: ${searchResponse.statusText}`
        );
        continue;
      }

      // parse the Spotify Web API response as a JSON object
      const searchJSON = await searchResponse.json();

      const searchResult: SearchResult = searchJSON.tracks;

      // attampt to store the song found as a Song object
      let song: Song;
      try {
        song = searchResult.items[0];
      } catch (err) {
        // if the API did not return data in the correct format, the print that error to the console and go to the next song found
        console.error(
          `Error getting the Song object from the Spotify API search result: ${err}`
        );
        continue;
      }

      // update our array stored in state to contain the new song
      // this approach is more user friendly than waiting for all the songs
      // because the user can see the songs being populated as they are found
      setSongList((prev) => {
        const newSong: Song[] = [song];
        return prev.concat(newSong);
      });
    }

    setLoading(false);
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

    // DEBUGGING PURPOSES ONLY vvv
    // window.alert(songList.length);
    // DEBUGGING PURPOSES ONLY ^^^

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
      // if there was an error getting the current user's profile, show the user some text to describe the issue
      return (
        <h1>
          Something went wrong! Try to reconnect your Spotify account. Visit
          Login above
        </h1>
      );
    }

    // convert the response promise to a json object
    const userJSON = await userResponse.json();

    // store the current user's Spotify ID to be used in the POST request to create a new playlist
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
        // provide the Spotify Web API the data to initialize the new playlist with
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

      // if there was something wrong creating the playlist, the give the user some text to help describe the issue
      // most likely nonexistant or expired access token
      return (
        <h1>
          Something went wrong creating the playlist! Please make sure your
          Spotify account is connected and try again
        </h1>
      );
    }

    // convert the response promise to a json object
    const playlistJSON = await playlistResponse.json();

    // attempt to store information about the new playlist that was returned by storing it as a Playlist object
    let newPlaylist: Playlist;
    try {
      newPlaylist = playlistJSON;
    } catch (err) {
      // if there was an error with the new playlist, then print that error to the console
      console.error(`Error getting new playlist's data: ${err}`);

      // give the user some help text to describe a likely solution
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
        // provide the list of songs to add
        // the Spotify Web API adds the songs by URI, so we provide a list of them here
        // and JSON.stringify() formats them in a way the API can understand
        body: JSON.stringify({
          uris: songURIs,
        }),
      }
    );

    // check to make sure the songs were added properly
    if (!populationResponse.ok) {
      // if something went wrong, print the error to the console
      console.error(
        `Error adding songs to playlist: ${populationResponse.statusText}`
      );

      // give the user some help text to provide a likely solution to the problem
      return (
        <h1>
          Sorry! There was an error adding songs to the playlist --{" "}
          {populationResponse.statusText} -- Please try again.
        </h1>
      );
    }

    // let the user know that the playlist was added to their account successfully
    window.alert(
      `Success! Playlist ${newPlaylist.name} added to ${
        userJSON.display_name === null ? "your" : userJSON.display_name + "'s"
      } Spotify account with ${songURIs.length} songs`
    );

    // debugging purposes only vvv
    // const populationJSON = await populationResponse.json();
    // window.alert(`Success! Snapshot ID: ${populationJSON.snapshot_id}`);
    // debugging purposes only ^^^
  }
  // ---------- CONFIRMATION FORM LOGIC ----------

  function removeSong(uri: string) {
    setSongList((prev) => {
      return prev.filter((song) => {
        return song.uri !== uri;
      });
    });
  }

  return (
    <div className={styles.generatorContainer}>
      <h2>
        Create a playlist by describing it:
        {!spotifyToken && <Link to="/login">Connect to Spotify to use!</Link>}
      </h2>
      <form
        className={styles.generatorForm}
        key="request-form"
        onSubmit={handleRequestSubmit}
      >
        {/* number of songs */}
        <span>Find me </span>
        <input
          className={styles.textInput}
          type="number"
          min="1"
          max="50"
          placeholder="Number of Songs"
          defaultValue={1}
          ref={reqNumRef}
          disabled={loading}
        />
        {/* description of songs */}
        <span> songs that fit the feeling of </span>
        <input
          className={styles.textInput}
          type="text"
          placeholder="Description of Songs"
          ref={reqDesireRef}
          disabled={loading}
        />
        <input
          className={styles.submitInput}
          type="submit"
          value="Generate"
          disabled={loading}
        />
      </form>
      {/* container for the list of songs that are found by the Spotify search */}
      <h4 className={styles.subheading}>
        Songs to be added to the playlist: {loading && "Loading..."}
      </h4>
      <div className={styles.songGridContainer}>
        {/* as Songs get added to the state array, they will populate this unordered list element
          with SongPreview elements that show a visual representation of the songs the user will be adding to their playlist */}
        {songList.map((song) => {
          return <SongCard song={song} removalFunc={removeSong} />;
        })}
      </div>
      <h4 className={styles.subheading}>
        Happy with the songs above? Name your new playlist!
      </h4>
      {/* confirmation form */}
      <form
        className={styles.generatorForm}
        key="confirmation-form"
        onSubmit={handleConfirmationSubmit}
      >
        {/* playlist name */}
        <input
          className={styles.textInput}
          type="text"
          placeholder="New Playlist Name"
          ref={confirmationNameRef}
          disabled={loading}
        />
        {/* playlist description */}
        <input
          className={styles.textInput}
          type="text"
          placeholder="New Playlist Description"
          ref={confirmationDescRef}
          disabled={loading}
        />
        <br />
        {/* submit button to run the handleConfirmationSubmit function,
        which creates the new playlist in the user's Spotify account
        and adds the songs to the playlist */}
        <input
          className={styles.submitInput}
          type="submit"
          value="Confirm"
          disabled={loading}
        />
      </form>
    </div>
  );
}
