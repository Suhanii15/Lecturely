const Lecture = require("../models/lectureModels");
const Notes = require("../models/notesModel");
const User = require("../models/userModels");
const { transcribeAudio, generateNotes } = require("./aiservices");

const processLectureJob = async (lectureId) => {
  let lecture;
  let flashcards;
  try {
     lecture = await Lecture.findById(lectureId).populate("user");

    if (!lecture) return;

    lecture.status = "processing";
    await lecture.save();

    // 1️⃣ Transcribe audio
    const transcript = await transcribeAudio(lecture.audioUrl);
    // 2️⃣ Generate notes based on user preference
    const notesContent = await generateNotes(
      transcript.text,
      lecture.user.notesPreference
    );

    // 3️⃣ Save notes
    await Notes.create({
      lecture: lecture._id,
      user: lecture.user._id,
      content: notesContent,
      format: lecture.user.notesPreference,
      chapters: transcript.chapters || [],
  entities: transcript.entities || [],
  speakers: transcript.utterances || [],


    });

    lecture.status = "completed";
    await lecture.save();
    console.log("lecture processed successfully");
  } catch (err) {
    console.error("Lecture processing failed:", err.message);
    if(lecture){
    lecture.status = "failed";
    await lecture.save();
    }
  }
};

module.exports = processLectureJob;
