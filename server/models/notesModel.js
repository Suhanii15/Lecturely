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
    chapters: [
    {
      headline: String,
      summary: String,
      start: Number,
      end: Number,
    },
  ],
   entities: [
    {
      entity_type: String,
      text: String,
      start: Number,
      end: Number,
    },
  ],

  speakers: [
    {
      speaker: String,
      text: String,
      start: Number,
      end: Number,
    },
  ],


  },
  { timestamps: true }
);

module.exports = mongoose.model("Notes", notesSchema);
