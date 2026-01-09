const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const { generateToken } = require("../lib/utils");
const Lecture = require("../models/lectureModels");
const { generateNotes } = require("../services/aiservices");
const Notes=require("../models/notesModel")

// ================== SIGN UP ==================
const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        notesPreference: user.notesPreference,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Signup failed" });
  }
};


// ================== LOGIN ==================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        notesPreference: user.notesPreference,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Login failed" });
  }
};


// ================== GET LOGGED IN USER ==================
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        notesPreference: req.user.notesPreference,
      },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch user" });
  }
};


// ================== UPDATE NOTES PREFERENCE ==================
const updateNotesPreference = async (req, res) => {
  try {
    const { notesPreference, email } = req.body;

    if (!["paragraph", "keypoints"].includes(notesPreference)) {
      return res.json({
        success: false,
        message: "Invalid preference value",
      });
    }

    req.user.notesPreference = notesPreference;
    req.user.email = email;
    await req.user.save();

    res.json({
      success: true,
      message: "Preference updated",
      notesPreference: req.user.notesPreference,
    });
const lectures = await Lecture.find({
      user: req.user._id,
      status: "completed",
    });

    for (const lecture of lectures) {
      const notes = await Notes.findOne({
        lecture: lecture._id,
        user: req.user._id,
      });
      if (!notes) continue;

      const regeneratedContent = await generateNotes(
        notes.transcript || notes.content, // fallback safe
        notesPreference
      );

      notes.content = regeneratedContent;
      notes.format = notesPreference;
      await notes.save();
    }
  } catch (error) {
    res.json({ success: false, message: "Failed to update preference" });
  }
};


     

module.exports={signUp, login, getMe,updateNotesPreference};