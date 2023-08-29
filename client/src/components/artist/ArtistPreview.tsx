import React from "react";
import { Artist, Image } from "../../SpotifyInterfaces";
import styles from "./artist.module.css";

interface ArtistPreviewProps {
  artist: Artist;
}

export default function ArtistPreview({ artist }: ArtistPreviewProps) {
  const artistName = artist.name;
  let artistImageURL: string = "";
  if (artist.images) artistImageURL = artist.images[0].url;

  return (
    <li className={styles.artistItem}>
      <div className={styles.artist}>
        <img
          className={styles.artistImage}
          src={artistImageURL}
          height={50}
          width={50}
          alt={artistName + " artist image"}
        />
        <span className={styles.artistName}>{artistName}</span>
      </div>
    </li>
  );
}
