const axios = require("axios");

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
if(!ASSEMBLYAI_API_KEY){
  throw new Error("AssemblyAI API key is missing");
}

// ==========================
// 1️⃣ Upload audio URL to AssemblyAI & get transcription
// ==========================
const transcribeAudio = async (audioUrl) => {
  try {
    // Send audio URL to AssemblyAI for transcription
    const uploadRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: audioUrl,
      },
      {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      }
    );

    const transcriptId = uploadRes.data.id;

    // Poll until transcription completes
    let attempts=0;
    const MAX_ATTEMPTS=20;
    let completed = false;
    let transcriptText = "";
    while (!completed && attempts < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, 3000)); // wait 3s
      const statusRes = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: { authorization: ASSEMBLYAI_API_KEY },
        }
      );
      if (statusRes.data.status === "completed") {
        completed = true;
        transcriptText = statusRes.data.text;
      } else if (statusRes.data.status === "error") {
        throw new Error("Transcription failed");
      }
    }

    return transcriptText;
  } catch (err) {
    console.error("AssemblyAI transcription error:", err.message);
    throw err;
  }
};

// ==========================
// 2️⃣ Generate notes (summary or keypoints)
// ==========================
const generateNotes = async (transcript, format = "paragraph") => {
  try {
    // AssemblyAI has "auto_summarize" and "auto_highlight" features
    const summaryPrompt =
      format === "keypoints"
        ? "Summarize this lecture in clear bullet points."
        : "Summarize this lecture in well-structured paragraph form.";

    // For simplicity, we can send a prompt to AssemblyAI's summary endpoint
    // Or we can just use the transcript as notes (demo purpose)
    // Here, we return transcript + format info
    return `${format === "keypoints" ? "• " : ""}${transcript}`;
  } catch (err) {
    console.error("AssemblyAI notes generation error:", err.message);
    throw err;
  }
};

module.exports = { transcribeAudio, generateNotes };
