const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
      unique: true, // one lecture → one notes
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true, // final generated notes
    },

    format: {
      type: String,
      enum: ["paragraph", "keypoints"],
      default: "paragraph",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notes", notesSchema);
