import React, { useState } from "react";
import useSettings from "../../context/SettingsContext";
import { Song, Playlist, SearchResult } from "../../SpotifyInterfaces";

export default function Generator() {
  //

  return (
    <>
      <h1>Generate a Playlist</h1>
      <form>
        <input /> {/* playlist name */}
        <input /> {/* playlist description */}
        <input /> {/* number of songs */}
        <input /> {/* description of songs */}
        <input type="submit" value="Generate" />
      </form>
    </>
  );
}
