import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/search">Search</Link>
      <Link to="/wrapped">Wrapped</Link>
      <Link to="/about">About</Link>
      <Link to="/login">Login</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}
