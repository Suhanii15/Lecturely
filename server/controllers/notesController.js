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


const updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.json({
        success: false,
        message: "Content is required",
      });
    }

    const notes = await Notes.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id, // IMPORTANT: ownership check
      },
      { content },
      { new: true }
    );

    if (!notes) {
      return res.json({
        success: false,
        message: "Notes not found or unauthorized",
      });
    }

    res.json({
      success: true,
      message: "Notes updated successfully",
      notes,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to update notes",
    });
  }
};

module.exports={ getNotesByLecture, updateNotes};