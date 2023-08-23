import React, { useState, FormEvent } from "react";
import useSettings from "../../context/SettingsContext";

export default function Prompter() {
  interface FormData {
    n: string;
    type: "song" | "artist" | "album" | "genre" | "emotion";
    context: string;
  }

  const settings = useSettings();
  const [formData, setFormData] = useState<FormData>({
    n: "1",
    type: "song",
    context: "",
  });

  const [displayText, setDisplayText] = useState<string>("");

  function handleInputUpdate(propName: string) {
    return (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [propName]: ev.target.value });
    };
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const newPrompt = { ...formData };
    if (newPrompt.context.trim().length === 0) return;

    const openAItoken = process.env.REACT_APP_OPENAI_API_KEY;
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAItoken}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "you are a music recommendation bot that cannot make conversation, even if you are explaining an error, you can only list songs.",
          },
          {
            role: "user",
            content: `Find me ${formData.n} songs on Spotify that are similar to the ${formData.type} "${formData.context}" and a ${settings.age} year old would especially enjoy. List songs in the following format, seperated by ",,", and NO MATTER WHAT, no other words or numbering: <SONG>::<ARTIST>`,
          },
        ],
        temperature: settings.temperature,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const message = data.choices[0].message.content;
        const promptTokenPrice = data.usage.prompt_tokens * 0.0000015;
        const completionTokenPrice = data.usage.completion_tokens * 0.000002;
        const totalCost = promptTokenPrice + completionTokenPrice;

        setDisplayText(
          `${message}\n\nPrompt Price: ${promptTokenPrice}\nCompletion Price: ${completionTokenPrice}\nTotal Price: ${totalCost}`
        );
      });

    setFormData({ n: "1", type: "song", context: "" });
  }

  return (
    <>
      <div className="prompter" key="prompter">
        <form
          className="prompter prompter-form"
          key="prompter-form"
          onSubmit={onSubmit}
        >
          Find me
          <input
            className="prompter prompter-input"
            key="prompter-input-number"
            type="number"
            defaultValue={1}
            min={1}
            max={50}
            onChange={handleInputUpdate("n")}
          />
          songs like this
          <select
            className="prompter prompter-input"
            key="prompter-input-type"
            form="prompter-form"
            name="Prompt Type"
            onChange={handleInputUpdate("type")}
          >
            <option value="song">Song</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
            <option value="genre">Genre</option>
            <option value="emotion">Emotion</option>
          </select>
          :
          <input
            className="prompter prompter-input"
            key="prompter-input-context"
            type="text"
            placeholder="Context"
            onChange={handleInputUpdate("context")}
          />
          <input
            className="prompter prompter-submit"
            key="prompter-submit"
            type="submit"
            value="Submit"
          />
        </form>
      </div>
      {displayText}
    </>
  );
}
