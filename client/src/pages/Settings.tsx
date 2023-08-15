import React from "react";
import useSettings, { useUpdateSettings } from "../context/SettingsContext";

export default function Settings() {
  const settings = useSettings();
  const updateSettings = useUpdateSettings();

  const updateTheme = (ev: React.ChangeEvent<HTMLInputElement>) =>
    updateSettings({ darkTheme: ev.target.value === "dark" ? true : false });

  return (
    <>
      <h1>Settings</h1>
      <p>
        current settings - Age: {settings.age} | Temperature:{" "}
        {settings.temperature} | Theme:{" "}
        {settings.darkTheme === true ? "Dark" : "Light"}
      </p>
      <h3>Modify Settings:</h3>
      <label
        className="settings settings-label"
        key="settings-age-label"
        htmlFor="settings-age-input"
      >
        Age:{" "}
      </label>
      <input
        className="settings settings-input"
        key="settings-age-input"
        type="number"
        min={1}
        max={100}
        defaultValue={settings.age}
        onChange={(ev) => updateSettings({ age: ev.target.valueAsNumber })}
      />
      <label
        className="settings settings-label"
        key="settings-temperature-label"
        htmlFor="settings-temperature-input"
      >
        Temperature:{" "}
      </label>
      <input
        className="settings settings-input"
        key="settings-temperature-input"
        type="number"
        min={0.0}
        max={1.0}
        step={0.01}
        defaultValue={settings.temperature}
        onChange={(ev) =>
          updateSettings({ temperature: ev.target.valueAsNumber })
        }
      />
      <br />
      <br />
      <label
        className="settings settings-label"
        key="settings-theme-label"
        form="settings-theme-form"
      >
        Theme:{" "}
      </label>
      <div className="settings settings-theme-form" key="settings-theme-form">
        <input
          className="settings settings-theme-radio"
          key="settings-light-radio"
          type="radio"
          name="theme"
          value="light"
          disabled={!settings.darkTheme}
          onChange={updateTheme}
        />
        <label
          className="settings settings-theme-label"
          key="settings-light-label"
          htmlFor="settings-light-radio"
        >
          Light
        </label>
        <input
          className="settings settings-theme-radio"
          key="settings-dark-radio"
          type="radio"
          name="theme"
          value="dark"
          disabled={settings.darkTheme}
          onChange={updateTheme}
        />
        <label
          className="settings settings-theme-label"
          key="settings-dark-label"
          htmlFor="settings-dark-radio"
        >
          Dark
        </label>
      </div>
    </>
  );
}
