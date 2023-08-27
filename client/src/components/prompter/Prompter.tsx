import React, { useState, FormEvent } from "react";
import useSettings from "../../context/SettingsContext";
import {
  Playlist,
  PlaylistSearchResult,
  SearchResult,
  Song,
} from "../../SpotifyInterfaces";

export default function Prompter() {
  interface FormData {
    n: string;
    type: "song" | "artist" | "album" | "genre" | "emotion";
    context: string;
  }

  const settings = useSettings();
  const [formData, setFormData] = useState<FormData>({
    n: "1",
    type: "song",
    context: "",
  });

  let gptRes: string = "";
  let songURIs: string[] = [];
  let playlistID: string = "";

  const spotifyAccessToken = sessionStorage.getItem("spotify-access-token");

  async function getSongURIs(openAIResponse: string) {
    window.alert("getting song URIs from " + openAIResponse);
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

    const songURIList = songs.map((song) => {
      return song.uri;
    });

    songURIs = songURIList;
  }

  async function createNewPlaylist(name: string, desc: string) {
    window.alert("Creating playlist");
    const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    });
    const userData = await userResponse.json();
    const userID = userData.id;

    const creationResponse = await fetch(
      `https://api.spotify.com/v1/users/${userID}/playlists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${spotifyAccessToken}`,
        },
        body: JSON.stringify({
          name: name,
          public: true,
          collaborative: false,
          description: desc,
        }),
      }
    );
    const creationData = await creationResponse.json();
    const newPlaylistID = creationData.id;
    playlistID = newPlaylistID;
  }

  async function addSongsToPlaylist(uris: string[]) {
    window.alert("adding songs to playlist");
    await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
      body: JSON.stringify({
        uris: uris,
      }),
    });
  }

  function handleInputUpdate(propName: string) {
    return (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [propName]: ev.target.value });
    };
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const newPrompt = { ...formData };
    if (newPrompt.context.trim().length === 0) return;

    const openAItoken = process.env.REACT_APP_OPENAI_API_KEY;
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAItoken}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "you are a music recommendation bot that cannot make conversation, even if you are explaining an error, you can only list songs.",
          },
          {
            role: "user",
            content: `Find me ${formData.n} songs on Spotify that are similar to the ${formData.type} "${formData.context}" and a ${settings.age} year old would especially enjoy. List songs in the following format, seperated by ",,", and NO MATTER WHAT, NO OTHER WORDS, CONTEXT, NUMBERING, OR COMMUNICATION: <SONG>::<ARTIST>`,
          },
        ],
        temperature: settings.temperature,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const message = data.choices[0].message.content;
        const promptTokenPrice = data.usage.prompt_tokens * 0.0000015;
        const completionTokenPrice = data.usage.completion_tokens * 0.000002;
        const totalCost = promptTokenPrice + completionTokenPrice;

        gptRes = message;
      });

    setFormData({ n: "1", type: "song", context: "" });
  }

  interface PlaylistFormData {
    name: string;
    description: string;
  }
  const initialPlaylistFormData: PlaylistFormData = {
    name: "New Playlist",
    description: "OpenAI-generated playlist",
  };
  const [playlistFormData, setPlaylistFormData] = useState<PlaylistFormData>(
    initialPlaylistFormData
  );

  function handlePlaylistInputUpdate(propName: string) {
    return (ev: React.ChangeEvent<HTMLInputElement>) => {
      setPlaylistFormData({ ...playlistFormData, [propName]: ev.target.value });
    };
  }

  return (
    <>
      <div className="prompter" key="prompter">
        <form
          className="prompter prompter-form"
          key="prompter-form"
          onSubmit={onSubmit}
        >
          Find me
          <input
            className="prompter prompter-input"
            key="prompter-input-number"
            type="number"
            defaultValue={1}
            min={1}
            max={50}
            onChange={handleInputUpdate("n")}
          />
          songs like this
          <select
            className="prompter prompter-input"
            key="prompter-input-type"
            form="prompter-form"
            name="Prompt Type"
            onChange={handleInputUpdate("type")}
          >
            <option value="song">Song</option>
            <option value="artist">Artist</option>
            <option value="emotion">Emotion</option>
          </select>
          :
          <input
            className="prompter prompter-input"
            key="prompter-input-context"
            type="text"
            placeholder="Context"
            onChange={handleInputUpdate("context")}
          />
          <input
            className="prompter prompter-submit"
            key="prompter-submit"
            type="submit"
            value="Submit"
          />
        </form>
      </div>
      <div>
        {gptRes}
        <form onSubmit={makePlaylist}>
          <input
            type="text"
            placeholder="Playlist Name"
            onChange={handlePlaylistInputUpdate("name")}
          />
          <input
            type="text"
            placeholder="Playlist Description"
            onChange={handlePlaylistInputUpdate("description")}
          />
          <input type="submit" value="Create Playlist" />
        </form>
      </div>
    </>
  );
}
