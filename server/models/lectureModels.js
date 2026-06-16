const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    audioUrl: {
      type: String,
      required: true,
    },

    audioPublicId: {
      type: String, // cloudinary public_id (useful for deletion later)
    },

    title: {
      type: String,
      default: "Untitled Lecture", // generated during processing
    },

    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
    },

    progressMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lecture", lectureSchema);
