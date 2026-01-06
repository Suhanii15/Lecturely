const express = require("express");
const {
  getNotesByLecture,
  regenerateNotes,
} = require("../controllers/notesController");

const protectedRoute = require("../middleware/auth");

const router = express.Router();

router.get("/:lectureId", protectedRoute, getNotesByLecture);
router.post("/regenerate/:lectureId", protectedRoute, regenerateNotes);

module.exports = router;
