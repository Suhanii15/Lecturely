import React, { useRef, useState } from "react";
import upload from "../assets/upload.png";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (!file || !title) {
      return alert("Please select file and enter title");
    }

    try {
      setLoading(true);
      const base64Audio = await convertToBase64(file);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/lectures/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          audio: base64Audio,
          title, // 🔑 send title
        }),
      });

      const data = await res.json();
      if (!data.success) return alert(data.message);

      const lectureId = data.lecture._id;

      await fetch(`http://localhost:5000/api/lectures/process/${lectureId}`, {
        method: "POST",
        headers: { token },
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-gray-700 font-bold text-2xl py-6">
        Upload Lecture
      </h1>

      <div className=" mx-50 h w-5xl bg-white w-full  rounded-xl shadow-md p-8">
        <div className="border-2 border-dashed border-violet-500 rounded-xl flex flex-col items-center p-8 gap-4">

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <img src={upload} alt="upload" className="h-32" />

          <p className="text-gray-600 text-sm">
            Upload your lecture audio
          </p>

          <button
            type="button"
            onClick={handleBrowseClick}
            className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-500 cursor-pointer transition"
          >
            Browse Files
          </button>

          {file && (
            <div className=" mt-4 space-y-3">
              <p className="text-sm text-gray-500 text-center">
                Selected: <span className="font-medium">{file.name}</span>
              </p>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Lecture title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
              />

              <button
                onClick={handleUpload}
                disabled={loading}
                className={`w-full py-2 rounded-md text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500"
                }`}
              >
                {loading ? "Uploading..." : "Upload & Continue"}
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4">
            MP3, WAV, M4A • Up to 100MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
