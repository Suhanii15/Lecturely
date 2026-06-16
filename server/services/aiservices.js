const axios = require("axios");

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
if (!ASSEMBLYAI_API_KEY) {
  throw new Error("AssemblyAI API key is missing");
}

const transcribeAudio = async (audioUrl) => {
  try {
    const uploadRes = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: audioUrl,
        auto_chapters: true,
        entity_detection: true,
        speaker_labels: true,
        iab_categories: true,
      },
      {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      }
    );

    const transcriptId = uploadRes.data.id;

    let attempts = 0;
    const MAX_ATTEMPTS = 720;
    const POLL_INTERVAL = 5000;
    while (attempts < MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));
      const statusRes = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: { authorization: ASSEMBLYAI_API_KEY },
        }
      );
      const data = statusRes.data;
      if (data.status === "completed") {
        console.log(`[transcribe] done in ${((attempts * POLL_INTERVAL) / 60000).toFixed(1)} min`);
        return data;
      } else if (data.status === "error") {
        throw new Error("Transcription failed: " + (data.error || "unknown"));
      }
      attempts++;
      if (attempts % 12 === 0) {
        console.log(`[transcribe] polling... (${attempts * 5}s elapsed, status: ${data.status})`);
      }
    }
    throw new Error("Transcription timed out after 60 minutes");
  } catch (err) {
    console.error("AssemblyAI transcription error:", err.message);
    throw err;
  }
};

const generateNotes = (transcript, format = "paragraph") => {
  const chapters = transcript.chapters || [];
  const text = transcript.text || "";

  if (!chapters.length) {
    return format === "keypoints"
      ? text
          .split(". ")
          .filter(Boolean)
          .map((s) => "• " + s.trim())
          .join("\n")
      : text;
  }

  if (format === "keypoints") {
    return chapters
      .map(
        (ch, i) =>
          `${i + 1}. ${ch.headline}\n   • ${ch.summary}`
      )
      .join("\n\n");
  }

  return chapters
    .map(
      (ch) =>
        `**${ch.headline}**\n\n${ch.summary}`
    )
    .join("\n\n");
};

module.exports = { transcribeAudio, generateNotes };
