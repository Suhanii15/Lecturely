const Lecture = require("../models/lectureModels");
const Notes = require("../models/notesModel");
const User = require("../models/userModels");
const { transcribeAudio, generateNotes } = require("./aiservices");

const processLectureJob = async (lectureId) => {
  let lecture;
  try {
     lecture = await Lecture.findById(lectureId).populate("user");

    if (!lecture) return;

    lecture.status = "processing";
    lecture.progressMessage = "Transcribing audio...";
    await lecture.save();
    console.log(`[processLecture ${lectureId}] transcribing...`);

    const transcript = await transcribeAudio(lecture.audioUrl);

    lecture.progressMessage = "Generating notes...";
    await lecture.save();
    console.log(`[processLecture ${lectureId}] generating notes...`);
    const notesContent = await generateNotes(
      transcript,
      lecture.user.notesPreference
    );

    lecture.progressMessage = "Saving notes...";
    await lecture.save();
    console.log(`[processLecture ${lectureId}] saving notes...`);
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
