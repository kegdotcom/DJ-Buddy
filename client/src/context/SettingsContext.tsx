import React, { useState, createContext, useContext, ReactNode } from "react";

// define settings interface and a default settings object
export interface Settings {
  age: number;
  temperature: number;
  darkTheme: boolean;
}
export const defaultSettings = { age: 18, temperature: 0.75, darkTheme: false };

// create contexts for the settings variable and the updateSettings function
const SettingsContext = createContext<Settings>(defaultSettings);
const UpdateSettingsContext = createContext<(v: Partial<Settings>) => void>(
  (v: Partial<Settings>) => {} // dummy function to allow type declaration
);

// export custom hooks to use settings and updateSettings
export default function useSettings() {
  return useContext(SettingsContext);
}
export function useUpdateSettings() {
  return useContext(UpdateSettingsContext);
}

// return SettingsProvider object for cleaner use of the providers
interface SPProps {
  children: ReactNode;
}
export function SettingsProvider({ children }: SPProps) {
  // set state variable for settings and initialize to the default settings
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // define function to update the application settings
  function updateSettings(newSetting: Partial<Settings>) {
    setSettings((prev) => {
      return { ...prev, ...newSetting };
    });
  }

  return (
    <SettingsContext.Provider value={settings}>
      <UpdateSettingsContext.Provider value={updateSettings}>
        {children}
      </UpdateSettingsContext.Provider>
    </SettingsContext.Provider>
  );
}
