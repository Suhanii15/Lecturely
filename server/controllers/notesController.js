const Notes = require("../models/notesModel");
const Lecture = require("../models/lectureModels");

const findUpdatedRange = (previousContent, updatedContent, highlight) => {
  const startIndex = highlight.startIndex || 0;
  const text = highlight.text || previousContent.slice(startIndex, highlight.endIndex);
  if (!text) return null;

  const candidates = [];
  let searchFrom = 0;
  let candidateStart = updatedContent.indexOf(text, searchFrom);

  while (candidateStart !== -1) {
    let contextScore = 0;
    for (let offset = 1; offset <= 40 && offset <= startIndex && offset <= candidateStart; offset += 1) {
      if (previousContent[startIndex - offset] !== updatedContent[candidateStart - offset]) break;
      contextScore += 1;
    }
    for (
      let offset = 0;
      offset < 40 && startIndex + text.length + offset < previousContent.length && candidateStart + text.length + offset < updatedContent.length;
      offset += 1
    ) {
      if (previousContent[startIndex + text.length + offset] !== updatedContent[candidateStart + text.length + offset]) break;
      contextScore += 1;
    }

    candidates.push({
      startIndex: candidateStart,
      contextScore,
      distance: Math.abs(candidateStart - startIndex),
    });
    searchFrom = candidateStart + 1;
    candidateStart = updatedContent.indexOf(text, searchFrom);
  }

  candidates.sort((a, b) => b.contextScore - a.contextScore || a.distance - b.distance);
  return candidates.length
    ? { startIndex: candidates[0].startIndex, endIndex: candidates[0].startIndex + text.length, text }
    : null;
};


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

    const notes = await Notes.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!notes) {
      return res.json({
        success: false,
        message: "Notes not found or unauthorized",
      });
    }

    const remappedHighlights = notes.highlights.flatMap((highlight) => {
      const updatedRange = findUpdatedRange(notes.content, content, highlight);
      if (!updatedRange) return [];
      highlight.text = updatedRange.text;
      highlight.startIndex = updatedRange.startIndex;
      highlight.endIndex = updatedRange.endIndex;
      return [highlight];
    });

    notes.content = content;
    notes.highlights = remappedHighlights;
    await notes.save();

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

const addHighlight = async (req, res) => {
  try {
    const { text, startIndex, endIndex, color } = req.body;

    const notes = await Notes.findOne({
      _id: req.params.noteId,
      user: req.user._id,
    });

    if (!notes) {
      return res.json({ success: false, message: "Notes not found" });
    }

    notes.highlights.push({
      text,
      startIndex,
      endIndex,
      color,
    });

    await notes.save();

    res.json({
      success: true,
      highlights: notes.highlights,
    });
  } catch (err) {
    res.json({ success: false, message: "Failed to add highlight" });
  }
};
const removeHighlight = async (req, res) => {
  try {
    const notes = await Notes.findOne({
      _id: req.params.noteId,
      user: req.user._id,
    });

    notes.highlights = notes.highlights.filter(
      (h) => h._id.toString() !== req.params.highlightId
    );

    await notes.save();

    res.json({ success: true, highlights: notes.highlights });
  } catch (err) {
    res.json({ success: false });
  }
};


module.exports={ getNotesByLecture, updateNotes, addHighlight, removeHighlight};