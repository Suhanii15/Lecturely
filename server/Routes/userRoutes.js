const express = require("express");
const {
  signUp,
  login,
  getMe,
  updateNotesPreference,
} = require("../controllers/userController");

const protectedRoute = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/me", protectedRoute, getMe);
router.put("/settings", protectedRoute, updateNotesPreference);

module.exports = router;
