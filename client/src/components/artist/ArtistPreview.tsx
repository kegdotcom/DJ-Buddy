import React from "react";
import { Artist, Image } from "../../SpotifyInterfaces";
import styles from "./artist.module.css";

interface ArtistPreviewProps {
  artist: Artist;
  index: number;
}

export default function ArtistPreview({ artist, index }: ArtistPreviewProps) {
  const artistName = artist.name;

  // get the url of the Artist's cover image, if available
  const artistImageURL: string = artist.images ? artist.images[0].url : "";

  // return a list item element that contains a visual representation of the artist and their image and name
  return (
    <li className={styles.artistItem}>
      <div className={styles.artist}>
        <span className={styles.artistText}>{index + 1}</span>
        <img
          className={styles.artistImage}
          src={artistImageURL}
          height={50}
          width={50}
          alt={artistName + " artist image"}
        />
        <span className={styles.artistText}>{artistName}</span>
      </div>
    </li>
  );
}
