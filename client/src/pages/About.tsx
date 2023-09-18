import React from "react";
import styles from "./styles/general.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <h1>About DJ Buddy</h1>
      <h5>
        DJ Buddy is a React application that uses the OpenAI Response API and
        the Spotify Web API in order to get you music recommendations!
      </h5>
    </div>
  );
}
