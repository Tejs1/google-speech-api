"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Ban, Volume2 } from "lucide-react";
import { useSpeechToText } from "@/hooks/useSpeechToText";

const SpeechToText: React.FC = () => {
  const {
    isRecording,
    currentRecognition,
    recognitionHistory,
    startRecording,
    stopRecording,
  } = useSpeechToText();

  return (
    <div className="container mx-auto py-8">
      <div>
        <h1 className="mb-4 text-3xl font-bold">Speech To Text</h1>

        <p className="mb-4">
          Click the &quot;Start&quot; button to begin recording and the
          &quot;Stop&quot; button to stop.
        </p>
        <div className="space-x-4">
          <Button
            variant={isRecording ? "destructive" : "default"}
            onClick={startRecording}
            disabled={isRecording}
          >
            <Mic className="mr-2 h-4 w-4" />
            Start
          </Button>
          <Button
            variant="secondary"
            onClick={stopRecording}
            disabled={!isRecording}
          >
            <Ban className="mr-2 h-4 w-4" />
            Stop
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Recognition History</h2>
        <Card>
          <CardHeader>
            <CardTitle>Transcriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recognitionHistory.map((tx, idx) => (
                <li key={idx} className="flex items-center">
                  <Volume2 className="mr-2 h-4 w-4" />
                  {tx}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold">Current Recognition</h4>
              <p>{currentRecognition}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeechToText;
