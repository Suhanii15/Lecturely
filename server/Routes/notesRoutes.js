const express = require("express");
const {
  getNotesByLecture,
  updateNotes,
  addHighlight,
  removeHighlight
} = require("../controllers/notesController");

const protectedRoute = require("../middleware/auth");

const router = express.Router();

router.get("/:lectureId", protectedRoute, getNotesByLecture);
router.put("/:id", protectedRoute, updateNotes);
router.post("/:noteId/highlight", protectedRoute, addHighlight);
router.delete("/:noteId/highlight/:highlightId", protectedRoute, removeHighlight);

module.exports = router;
