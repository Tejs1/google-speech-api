import SpeechToText from "../components/SpeechToText";
import TextToSpeech from "../components/TextToSpeech";
export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Speech-to-Text and Text-to-Speech Web App
      </h1>
      <SpeechToText />
      <TextToSpeech />
    </main>
  );
}
