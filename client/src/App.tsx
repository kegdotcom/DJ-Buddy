import React from "react";
import { Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext";

import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Wrapped from "./pages/Wrapped";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Connect from "./pages/SpotifyConnection";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <SettingsProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wrapped" element={<Wrapped />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </SettingsProvider>
    </>
  );
}

export default App;
