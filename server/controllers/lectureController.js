const Lecture = require("../models/lectureModels");
const cloudinary = require("../lib/cloudinary");
const processLectureJob = require("../services/lectureProcessor");


const uploadLecture = async (req, res) => {
  try {
    const { audio } = req.body;

    if (!audio) {
      return res.json({
        success: false,
        message: "Audio file is required",
      });
    }

    // Upload audio to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(audio, {
      resource_type: "video", // IMPORTANT for audio
      folder: "lectures",
    });

    const lecture = await Lecture.create({
      user: req.user._id,
      audioUrl: uploadResponse.secure_url,
      audioPublicId: uploadResponse.public_id,
      status: "uploaded",
    });

    res.json({
      success: true,
      lecture,
      message: "Lecture uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Failed to upload lecture",
    });
  }
};


//get all lectures
const getMyLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      lectures,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Failed to fetch lectures",
    });
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
      return res.json({
        success: false,
        message: "Lecture not found",
      });
    }

    if (lecture.status === "completed") {
      return res.json({
        success: false,
        message: "Lecture already processed",
      });
    }

    // Immediately respond to frontend
    res.json({
      success: true,
      message: "Lecture processing started",
    });

    processLectureJob(lecture._id);

  } catch (error) {
    res.json({
      success: false,
      message: "Failed to process lecture",
    });
  }
};


module.exports={uploadLecture,getMyLectures,processLecture}