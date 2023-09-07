import React, { useState, createContext, useContext, ReactNode } from "react";

/**
 * interface that defines the user's settings/preferences
 *
 * @member {number} age - the age of the user
 * @member {string} gender - the gender of the user
 * @member {number} temperature - the variability of the OpenAI response
 * @member {boolean} darkTheme - whether or not the user has selected the dark theme
 */
export interface Settings {
  age: number;
  gender: string;
  temperature: number;
  darkTheme: boolean;
}
export const defaultSettings = {
  age: 18,
  gender: "male",
  temperature: 0.75,
  darkTheme: false,
};

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

  // return an element that can be wrapped around the application for the context provider and the updater context provider
  return (
    <SettingsContext.Provider value={settings}>
      <UpdateSettingsContext.Provider value={updateSettings}>
        {children}
      </UpdateSettingsContext.Provider>
    </SettingsContext.Provider>
  );
}
