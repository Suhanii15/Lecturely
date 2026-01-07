const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 🔹 User preference for notes format
    notesPreference: {
      type: String,
      enum: ["paragraph", "keypoints"],
      default: "paragraph",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
