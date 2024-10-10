// app/actions.ts
"use server";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { env } from "@/env";
import { type GoogleServiceKey } from "../types";

// import { SpeechClient } from "@google-cloud/speech";

export async function convertTextToSpeech(
  text: string,
): Promise<{ audioContent: string }> {
  const credential: GoogleServiceKey = JSON.parse(
    env.GOOGLE_APPLICATION_CREDENTIALS.toString(),
  ) as GoogleServiceKey;
  try {
    const client = new TextToSpeechClient({
      credentials: {
        client_email: credential.client_email,
        private_key: credential.private_key,
      },
    });

    const [response] = await client.synthesizeSpeech({
      input: { text: text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    });

    return {
      audioContent: response.audioContent
        ? Buffer.from(response.audioContent).toString("base64")
        : "",
    };
  } catch (error) {
    console.error("Error in text-to-speech:", error);
    throw new Error("Failed to convert text to speech");
  }
}
