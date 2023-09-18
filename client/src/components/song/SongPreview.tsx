import React from "react";
import { Song } from "../../SpotifyInterfaces";
import Icon from "../Icon";
import styles from "./song.module.css";

interface SongPreviewProps {
  song: Song;
  index: number;
}

export default function SongPreview({ song, index }: SongPreviewProps) {
  // get the Song's name
  const songName: string = song.name;

  // get the URL of the song's cover art
  const songImageURL: string = song.album.images[0].url;

  // get the song's explicitivity
  const songExplicit: boolean = song.explicit;

  // get the song's artists and process them into a string
  const songArtists: string[] = song.artists.map((artist) => {
    return artist.name;
  });

  // initialize the string with the first artist
  let songArtistString = songArtists[0];
  // if there is more than one artist, add a comma before the next artist and append them
  // this way avoids any accidental leading or trailing commas in the UI
  for (let i = 1; i < songArtists.length; i++) {
    songArtistString += ", ";
    songArtistString += songArtists[i];
  }

  // return a list item element that provides the following:
  // a visual representation of the song and its title, artist(s), whether it is explicit, and its album's cover
  return (
    <li className={styles.songItem}>
      <div className={styles.song}>
        <span className={styles.songText}>{index + 1}</span>
        <img className={styles.songImage} src={songImageURL} />
        <span className={styles.songText}>
          {songName} - {songArtistString}
        </span>
        <span className={styles.songIcon}>
          {/* use the explicit icon if the song is explicit, and the square icon if not
          the square icon had the same outer box as the explicit icon, but without the 'E' */}
          <Icon name={songExplicit ? "explicit" : "square"} />
        </span>
      </div>
    </li>
  );
}
