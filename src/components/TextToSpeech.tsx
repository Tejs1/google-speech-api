// app/components/TextToSpeech.tsx
"use client";

import { useState, type ChangeEvent } from "react";
import { convertTextToSpeech } from "../actions";
import { Button } from "./ui/button";

export default function TextToSpeech() {
  const [textInput, setTextInput] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");

  const handleConvert = async () => {
    try {
      const result = await convertTextToSpeech(textInput);
      setAudioSrc(`data:audio/wav;base64,${result.audioContent}`);
    } catch (error) {
      console.error("Error converting text to speech:", error);
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">Text-to-Speech</h2>
      <p className="mb-4">
        Enter text in the textarea below and click the &quot;Convert to
        Speech&quot; button to hear it.
      </p>
      <textarea
        value={textInput}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setTextInput(e.target.value)
        }
        className="mb-2 w-full rounded border p-2"
        placeholder="Enter text"
        rows={4}
      ></textarea>
      <Button onClick={handleConvert} className="rounded px-4 py-2 text-white">
        Convert to Speech
      </Button>
      {audioSrc && <audio className="mt-4" controls src={audioSrc}></audio>}
    </div>
  );
}
