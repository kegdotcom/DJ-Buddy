import React, { useState, createContext, useContext, ReactNode } from "react";

const SpotifyTokenContext = createContext<string>("");
const UpdateSpotifyTokenContext = createContext<(t: string) => void>(
  (t: string) => {}
);

export function useSpotifyToken() {
  return useContext(SpotifyTokenContext);
}

export function useUpdateSpotifyToken() {
  return useContext(UpdateSpotifyTokenContext);
}

interface STPProps {
  children: ReactNode;
}
export function SpotifyTokenProvider({ children }: STPProps) {
  const [token, setToken] = useState<string>("");

  return (
    <SpotifyTokenContext.Provider value={token}>
      <UpdateSpotifyTokenContext.Provider value={setToken}>
        {children}
      </UpdateSpotifyTokenContext.Provider>
    </SpotifyTokenContext.Provider>
  );
}
