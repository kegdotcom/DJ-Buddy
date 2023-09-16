import React from "react";
import { Routes, Route } from "react-router-dom";

// import SettingsProvider to act as the context provider for our app
import { SettingsProvider } from "./context/SettingsContext";

// import the navigation bar and all pages that will be routed to
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import Generator from "./pages/Generator";
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
          <Route path="/generate" element={<Generator />} />
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
