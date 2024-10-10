"use client";
import React from "react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TextToSpeech: React.FC = () => {
  const { textInput, audioSrc, handleInputChange, handleConvert } =
    useTextToSpeech();

  return (
    <div className="container mx-auto py-8">
      <h2 className="mb-2 text-xl font-semibold">Text-to-Speech</h2>
      <p className="mb-4">
        Enter text in the textarea below and click the &quot;Convert to
        Speech&quot; button to hear it.
      </p>
      <Textarea
        value={textInput}
        onChange={handleInputChange}
        className="mb-4 w-full"
        placeholder="Enter text"
        rows={4}
      />
      <Button onClick={handleConvert} className="mb-4">
        Convert to Speech
      </Button>
      {audioSrc && <audio className="w-full" controls src={audioSrc}></audio>}
    </div>
  );
};

export default TextToSpeech;
