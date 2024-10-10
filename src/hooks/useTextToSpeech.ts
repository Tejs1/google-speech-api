"use client";
import { useState, useCallback } from "react";
import { convertTextToSpeech } from "@/services/textToSpeechService";

export const useTextToSpeech = () => {
  const [textInput, setTextInput] = useState<string>("");
  const [audioSrc, setAudioSrc] = useState<string>("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextInput(e.target.value);
    },
    [],
  );

  const handleConvert = useCallback(async () => {
    try {
      const result = await convertTextToSpeech(textInput);
      setAudioSrc(`data:audio/wav;base64,${result.audioContent}`);
    } catch (error) {
      console.error("Error converting text to speech:", error);
      // Here you could set an error state and display it to the user
    }
  }, [textInput]);

  return {
    textInput,
    audioSrc,
    handleInputChange,
    handleConvert,
  };
};
