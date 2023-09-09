import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

export default function Navbar() {
  // navigation element containing React Router Links to the different pages of this application
  return (
    <nav className={styles.navbar}>
      <span className={styles.linkBox}>
        <Link className={styles.link} to="/">
          Home
        </Link>
      </span>
      <span className={styles.linkBox}>
        <Link className={styles.link} to="/search">
          Search
        </Link>
      </span>
      <span className={styles.linkBox}>
        <Link className={styles.link} to="/wrapped">
          Wrapped
        </Link>
      </span>
      <span className={styles.linkBox}>
        <Link className={styles.link} to="/about">
          About
        </Link>
      </span>
      <span className={styles.linkBox}>
        <Link className={styles.link} to="/login">
          Login
        </Link>
      </span>
      <span className={styles.linkBox}>
        <Link className={styles.link} to="/settings">
          Settings
        </Link>
      </span>
    </nav>
  );
}
