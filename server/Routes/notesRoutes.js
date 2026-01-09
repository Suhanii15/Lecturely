const express = require("express");
const {
  getNotesByLecture,
  updateNotes
} = require("../controllers/notesController");

const protectedRoute = require("../middleware/auth");

const router = express.Router();

router.get("/:lectureId", protectedRoute, getNotesByLecture);
router.put("/:id", protectedRoute, updateNotes);

module.exports = router;
