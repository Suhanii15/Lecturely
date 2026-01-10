const mongoose = require("mongoose");
const highlightSchema = new mongoose.Schema({
  text: String,
  color: {
    type: String,
    default: "yellow",
  },
  startIndex: Number,
  endIndex: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

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

  highlights: [highlightSchema], 

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notes", notesSchema);
