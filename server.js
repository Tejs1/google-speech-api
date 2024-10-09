require("dotenv").config()
console.log(
	"GOOGLE_APPLICATION_CREDENTIALS:",
	process.env.GOOGLE_APPLICATION_CREDENTIALS,
)

const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const { TextToSpeechClient } = require("@google-cloud/text-to-speech")
const { SpeechClient } = require("@google-cloud/speech")
const fs = require("fs")
const util = require("util")

const app = express()
const port = 3000

app.use(bodyParser.json())

// Set up Google Cloud Text-to-Speech and Speech-to-Text clients
const ttsClient = new TextToSpeechClient()
const sttClient = new SpeechClient()

// API route for Text-to-Speech
app.post("/api/tts", async (req, res) => {
	const { text } = req.body
	const request = {
		input: { text: text },
		voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
		audioConfig: { audioEncoding: "MP3" },
	}

	const [response] = await ttsClient.synthesizeSpeech(request)
	res.json({ audioContent: response.audioContent.toString("base64") })
})

// API route for Speech-to-Text (optional; use for recorded files)
app.post("/api/stt", async (req, res) => {
	const audio = req.body.audio // base64 encoded audio file
	const audioBytes = audio.toString("base64")

	const request = {
		audio: { content: audioBytes },
		config: {
			encoding: "LINEAR16",
			sampleRateHertz: 16000,
			languageCode: "en-US",
		},
	}

	const [response] = await sttClient.recognize(request)
	const transcription = response.results
		.map(result => result.alternatives[0].transcript)
		.join("\n")
	res.json({ transcription })
})

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
})
