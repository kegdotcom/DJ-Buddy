import React from "react";
import { Song } from "../../SpotifyInterfaces";
import Icon from "../Icon";
import styles from "./song-card.module.css";

interface SongCardProps {
  song: Song;
  removalFunc: (v: string) => void;
}

export default function SongCard({ song, removalFunc }: SongCardProps) {
  let name = song.name.replaceAll(new RegExp("\\(feat.*\\)", "g"), "").trim();
  if (name.length > 30) name = name.substring(0, 30).trim() + "...";
  const explicit: boolean = song.explicit;
  const artistNames: string[] = song.artists.map((artist) => {
    return artist.name;
  });
  let artists: string = artistNames.join(", ");
  if (artists.length > 30) artists = artists.substring(0, 30).trim() + "...";
  const imageURL: string =
    song.album.images.length > 0 ? song.album.images[0].url : "";

  function removeSong() {
    removalFunc(song.uri);
  }

  return (
    <div className={styles.songCard}>
      {explicit && (
        <div title="Explicit" className={styles.explicitIcon}>
          <Icon name="explicit-fill" />
        </div>
      )}
      <div className={styles.deleteButtonContainer}>
        <button className={styles.deleteButton} onClick={removeSong}>
          <Icon name="trash" />
        </button>
      </div>
      <img
        className={styles.songImage}
        src={imageURL}
        alt={song.name + " Image"}
      />
      <div className={styles.songText}>
        <span className={styles.songName}>{name}</span>
        <br />
        <span className={styles.songArtist}>{artists}</span>
      </div>
    </div>
  );
}
