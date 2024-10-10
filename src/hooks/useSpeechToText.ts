/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { BACKEND_URL } from "@/constants";
import { type WordRecognized } from "@/types";

export const useSpeechToText = () => {
  const [connection, setConnection] = useState<Socket>();
  const [currentRecognition, setCurrentRecognition] = useState<string>("");
  const [recognitionHistory, setRecognitionHistory] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const processorRef = useRef<AudioWorkletNode>();
  const audioContextRef = useRef<AudioContext>();
  const audioInputRef = useRef<MediaStreamAudioSourceNode>();

  const speechRecognized = useCallback((data: WordRecognized) => {
    if (data.isFinal) {
      setCurrentRecognition("...");
      setRecognitionHistory((old) => [data.text, ...old]);
    } else {
      setCurrentRecognition(data.text + "...");
    }
  }, []);

  const startRecording = useCallback(() => {
    const socket = io(BACKEND_URL);
    socket.on("connect", () => {
      console.log("connected", socket.id);
      setConnection(socket);
      socket.emit("startGoogleCloudStream");
      setIsRecording(true);
    });

    socket.on("receive_audio_text", (data: WordRecognized) => {
      speechRecognized(data);
    });

    socket.on("disconnect", () => {
      console.log("disconnected", socket.id);
      setIsRecording(false);
    });
  }, [speechRecognized]);

  const stopRecording = useCallback(() => {
    if (!connection) return;
    connection.emit("endGoogleCloudStream");
    connection.disconnect();
    processorRef.current?.disconnect();
    audioInputRef.current?.disconnect();
    audioContextRef.current?.close();
    setConnection(undefined);
    setIsRecording(false);
  }, [connection]);

  useEffect(() => {
    if (connection && isRecording) {
      const setupAudioProcessing = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: "default",
            sampleRate: 16000,
            sampleSize: 16,
            channelCount: 1,
          },
          video: false,
        });

        audioContextRef.current = new window.AudioContext();
        await audioContextRef.current.audioWorklet.addModule(
          "/src/worklets/recorderWorkletProcessor.js",
        );
        audioContextRef.current.resume();

        audioInputRef.current =
          audioContextRef.current.createMediaStreamSource(stream);
        processorRef.current = new AudioWorkletNode(
          audioContextRef.current,
          "recorder.worklet",
        );

        processorRef.current.connect(audioContextRef.current.destination);
        audioInputRef.current.connect(processorRef.current);

        processorRef.current.port.onmessage = (event: MessageEvent) => {
          const audioData = event.data as Float32Array;
          connection.emit("send_audio_data", { audio: audioData });
        };
      };

      setupAudioProcessing();
    }

    return () => {
      if (isRecording) {
        processorRef.current?.disconnect();
        audioInputRef.current?.disconnect();
        audioContextRef.current?.close();
      }
    };
  }, [connection, isRecording]);

  return {
    isRecording,
    currentRecognition,
    recognitionHistory,
    startRecording,
    stopRecording,
  };
};
