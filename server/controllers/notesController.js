const Notes = require("../models/notesModel");
const Lecture = require("../models/lectureModels");

const getNotesByLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
 const lecture = await Lecture.findOne({
      _id: lectureId,
      user: req.user._id,
    });

    if (!lecture) {
      return res.json({
        success: false,
        message: "Lecture not found",
      });
    }

    const notes = await Notes.findOne({
      lecture: lectureId,
      user: req.user._id,
    });

    if (!notes) {
      return res.json({
        success: false,
        message: "Notes not found",
      });
    }

    res.json({
      success: true,
    lecture,
      notes,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};

const regenerateNotes = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { format } = req.body; // paragraph | keypoints

    const lecture = await Lecture.findOne({
      _id: lectureId,
      user: req.user._id,
    });

    if (!lecture || lecture.status !== "completed") {
      return res.json({
        success: false,
        message: "Lecture not ready for regeneration",
      });
    }

    // respond immediately
    res.json({
      success: true,
      message: "Notes regeneration started",
    });

  } catch (error) {
    res.json({
      success: false,
      message: "Failed to regenerate notes",
    });
  }
};


module.exports = { getNotesByLecture, regenerateNotes };