import React, { ReactNode } from "react";
import { Playlist, Image } from "../../SpotifyInterfaces";
import Icon from "../Icon";
import styles from "./PlaylistNode.module.css";

interface PlaylistNodeProps {
  playlists: Playlist[];
}
export default function PlaylistNode({ playlists }: PlaylistNodeProps) {
  const playlistItems: ReactNode[] = playlists.map((playlist) => {
    return <PlaylistItem id={playlist.id} playlist={playlist} />;
  });
  return (
    <div className={styles.playlistNode}>
      <ul className={styles.playlistList}>{playlistItems}</ul>
    </div>
  );
}

interface PlaylistProps {
  id: string;
  playlist: Playlist;
}
export function PlaylistItem({ id, playlist }: PlaylistProps) {
  let imageURL = "";
  if (playlist.images.length === 1) {
    imageURL = playlist.images[0].url;
  } else if (playlist.images.length === 3) {
    imageURL = playlist.images[1].url;
  }

  return (
    <li key={id}>
      <div className={styles.playlist}>
        <img
          className={styles.playlistImage}
          src={imageURL}
          placeholder="Playlist Logo"
          height="50"
          width="50"
        ></img>
        {playlist.name}
        <span className={styles.playlistPrivacy}>
          <Icon name={playlist.public ? "unlock" : "lock"} />
        </span>
      </div>
    </li>
  );
}
