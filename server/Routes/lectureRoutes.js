const express = require("express");
const {
  uploadLecture,
  getMyLectures,
  processLecture,
  deleteLecture
} = require("../controllers/lectureController");

const protectedRoute = require("../middleware/auth");

const router = express.Router();

router.post("/upload", protectedRoute, uploadLecture);
router.get("/", protectedRoute, getMyLectures);
router.post("/process/:lectureId", protectedRoute, processLecture);
router.delete("/:lectureId", protectedRoute, deleteLecture);

module.exports = router;
