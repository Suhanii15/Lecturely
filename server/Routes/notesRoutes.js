const express = require("express");
const {
  getNotesByLecture,
} = require("../controllers/notesController");

const protectedRoute = require("../middleware/auth");

const router = express.Router();

router.get("/:lectureId", protectedRoute, getNotesByLecture);

module.exports = router;
