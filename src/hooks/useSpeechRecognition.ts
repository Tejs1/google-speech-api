import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { io, type Socket } from "socket.io-client";
import {
  addRecognition,
  setCurrentRecognition,
} from "@/redux/slices/speechSlice";
import { BACKEND_URL } from "@/config";
import { type AppDispatch } from "@/redux/store";

interface WordRecognized {
  isFinal: boolean;
  text: string;
}

export const useSpeechRecognition = () => {
  const dispatch: AppDispatch = useDispatch();
  const socketRef = useRef<Socket>();
  const processorRef = useRef<AudioWorkletNode>();
  const audioContextRef = useRef<AudioContext>();
  const audioInputRef = useRef<MediaStreamAudioSourceNode>();

  const connect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    socketRef.current = io(BACKEND_URL);
    socketRef.current.on("connect", () => {
      console.log("connected", socketRef.current?.id);
      socketRef.current?.emit("startGoogleCloudStream");
      initializeAudioProcessing();
    });

    socketRef.current.on("receive_audio_text", (data: WordRecognized) => {
      if (data.isFinal) {
        dispatch(setCurrentRecognition("..."));
        dispatch(addRecognition(data.text));
      } else {
        dispatch(setCurrentRecognition(data.text + "..."));
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log("disconnected", socketRef.current?.id);
    });
  };

  const disconnect = () => {
    if (!socketRef.current) return;
    socketRef.current.emit("endGoogleCloudStream");
    socketRef.current.disconnect();
    cleanupAudioProcessing();
  };

  const initializeAudioProcessing = async () => {
    try {
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
      await audioContextRef.current.resume();

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
        socketRef.current?.emit("send_audio_data", { audio: audioData });
      };
    } catch (error) {
      console.error("Error initializing audio processing:", error);
    }
  };

  const cleanupAudioProcessing = () => {
    processorRef.current?.disconnect();
    audioInputRef.current?.disconnect();
    if (audioContextRef.current?.state !== "closed") {
      void audioContextRef.current?.close();
    }
  };

  useEffect(() => {
    return () => {
      cleanupAudioProcessing();
    };
  }, []);

  return { connect, disconnect };
};
