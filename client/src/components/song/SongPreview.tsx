import React from "react";
import { Song } from "../../SpotifyInterfaces";
import Icon from "../Icon";
import styles from "./song.module.css";

interface SongPreviewProps {
  song: Song;
}

export default function SongPreview({ song }: SongPreviewProps) {
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
  let songArtistString = songArtists[0];
  for (let i = 1; i < songArtists.length; i++) {
    songArtistString += ", ";
    songArtistString += songArtists[i];
  }

  return (
    <li className={styles.songItem}>
      <div className={styles.song}>
        <img className={styles.songImage} src={songImageURL} />
        <span className={styles.songName}>
          {songName} - {songArtistString}
        </span>
        <span className={styles.songIcon}>
          <Icon name={songExplicit ? "explicit" : "square"} />
        </span>
      </div>
    </li>
  );
}
