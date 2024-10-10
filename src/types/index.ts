// src/types/index.ts
export interface WordRecognized {
  isFinal: boolean;
  text: string;
}

export interface AudioConfig {
  deviceId: string;
  sampleRate: number;
  sampleSize: number;
  channelCount: number;
}

export interface GoogleServiceKey {
  client_email: string;
  private_key: string;
}
