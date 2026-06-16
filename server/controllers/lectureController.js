const Lecture = require("../models/lectureModels");
const Notes = require("../models/notesModel");
const cloudinary = require("../lib/cloudinary");
const processLectureJob = require("../services/lectureProcessor");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const os = require("os");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const CLOUDINARY_MAX = 90 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 1024 },
}).single("audio");

const compressAudio = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    ffmpeg(inputPath)
      .audioCodec("libopus")
      .audioBitrate("24k")
      .audioChannels(1)
      .addOutputOption("-compression_level 0")
      .format("ogg")
      .on("progress", (info) => {
        if (info.percent) console.log(`  compress: ${info.percent.toFixed(0)}%`);
      })
      .on("end", () => {
        console.log(`  compress done in ${((Date.now() - startTime) / 1000).toFixed(0)}s`);
        resolve();
      })
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
};

const uploadToCloudinary = async (buffer, folder, ext) => {
  const tempId = `lecture_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const rawPath = path.join(os.tmpdir(), tempId + (ext || ""));
  const compressedPath = path.join(os.tmpdir(), tempId + "_compressed.ogg");
  const cleanup = () => {
    fs.unlink(rawPath, () => {});
    fs.unlink(compressedPath, () => {});
  };

  fs.writeFileSync(rawPath, buffer);
  console.log(`[uploadToCloudinary] raw file size: ${(buffer.length / 1024 / 1024).toFixed(1)} MB`);

  let uploadPath = rawPath;
  if (buffer.length > CLOUDINARY_MAX) {
    console.log("[uploadToCloudinary] file >90MB, compressing...");
    await compressAudio(rawPath, compressedPath);
    const compressedSize = fs.statSync(compressedPath).size;
    console.log(`[uploadToCloudinary] compressed size: ${(compressedSize / 1024 / 1024).toFixed(1)} MB`);
    uploadPath = compressedPath;
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      uploadPath,
      { resource_type: "auto", folder },
      (error, result) => {
        cleanup();
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

const uploadLecture = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.code, err.message);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.json({
          success: false,
          message: "File too large. Maximum size is 1GB.",
        });
      }
      return res.json({ success: false, message: "Upload error: " + err.message });
    }

    try {
      let buffer;
      let title;

      let ext = ".mp3";
      if (req.file) {
        buffer = req.file.buffer;
        title = req.body.title?.trim() || "Untitled Lecture";
        ext = path.extname(req.file.originalname) || ".mp3";
      } else if (req.body && req.body.audio) {
        const base64 = req.body.audio;
        const matches = base64.match(/^data:([A-Za-z-+\/]+)?;base64,(.+)$/);
        const data = matches ? matches[2] : base64;
        buffer = Buffer.from(data, "base64");
        title = req.body.title?.trim() || "Untitled Lecture";
        if (matches && matches[1]) ext = "." + matches[1].split("/")[1];
      } else {
        return res.json({
          success: false,
          message: "No audio file received. Send as FormData ('audio' field) or base64 JSON ('audio' key).",
        });
      }

      const uploadResponse = await uploadToCloudinary(buffer, "lectures", ext);

      const lecture = await Lecture.create({
        user: req.user._id,
        audioUrl: uploadResponse.secure_url,
        audioPublicId: uploadResponse.public_id,
        status: "uploaded",
        title,
      });

      res.json({ success: true, lecture, message: "Lecture uploaded successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      const msg = error.errors
        ? Object.values(error.errors).map((e) => e.message).join("; ")
        : error.message || "Failed to upload lecture";
      res.json({ success: false, message: msg });
    }
  });
};

const getMyLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, lectures });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch lectures" });
  }
};

const processLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findOne({
      _id: lectureId,
      user: req.user._id,
    });

    if (!lecture) {
      return res.json({ success: false, message: "Lecture not found" });
    }
    if (lecture.status === "completed") {
      return res.json({ success: false, message: "Lecture already processed" });
    }

    res.json({ success: true, message: "Lecture processing started" });
    processLectureJob(lecture._id);
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Failed to process lecture" });
  }
};

const deleteLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findOne({
      _id: lectureId,
      user: req.user._id,
    });
    if (!lecture) {
      return res.json({ success: false, message: "Lecture not found" });
    }
    if (lecture.audioPublicId) {
      await cloudinary.uploader.destroy(lecture.audioPublicId, {
        resource_type: "video",
      });
    }
    await Lecture.deleteOne({ _id: lectureId });
    await Notes.deleteMany({ lecture: lectureId });
    res.json({ success: true, message: "Lecture deleted successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to delete lecture" });
  }
};

const updateLectureTitle = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.json({ success: false, message: "Title cannot be empty" });
    }
    const lecture = await Lecture.findOne({
      _id: lectureId,
      user: req.user._id,
    });
    if (!lecture) {
      return res.json({ success: false, message: "Lecture not found" });
    }
    lecture.title = title.trim();
    await lecture.save();
    res.json({ success: true, message: "Title updated", lecture });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Failed to update title" });
  }
};

module.exports = {
  uploadLecture,
  getMyLectures,
  processLecture,
  deleteLecture,
  updateLectureTitle,
};
