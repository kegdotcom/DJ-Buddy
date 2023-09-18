import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles/general.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Home</h1>
      <h3>Welcom to DJ Buddy!</h3>
      <h5>
        To get the full functionality of this site, please{" "}
        <Link to="/login">Log in</Link> to Spotify
      </h5>
    </div>
  );
}
