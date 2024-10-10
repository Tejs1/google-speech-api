import SpeechToText from "../components/SpeechToText";
import TextToSpeech from "../components/TextToSpeech";
export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center justify-center">
        <h1 className="mb-4 text-3xl font-bold">
          Speech-to-Text and Text-to-Speech Web App
        </h1>
      </div>

      <SpeechToText />
      <TextToSpeech />
    </main>
  );
}
