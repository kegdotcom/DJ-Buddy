import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

export default function Navbar() {
  // navigation element containing React Router Links to the different pages of this application
  return (
    <nav className={styles.navbar}>
      <span className={styles.navbarLink}>
        <Link to="/">Home</Link>
      </span>
      <span className={styles.navbarLink}>
        <Link to="/search">Search</Link>
      </span>
      <span className={styles.navbarLink}>
        <Link to="/wrapped">Wrapped</Link>
      </span>
      <span className={styles.navbarLink}>
        <Link to="/about">About</Link>
      </span>
      <span className={styles.navbarLink}>
        <Link to="/login">Login</Link>
      </span>
      <span className={styles.navbarLink}>
        <Link to="/settings">Settings</Link>
      </span>
    </nav>
  );
}
