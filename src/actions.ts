// app/actions.ts
"use server";

import { TextToSpeechClient } from "@google-cloud/text-to-speech";
// import { SpeechClient } from "@google-cloud/speech";

export async function convertTextToSpeech(
  text: string,
): Promise<{ audioContent: string }> {
  try {
    const client = new TextToSpeechClient();

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
