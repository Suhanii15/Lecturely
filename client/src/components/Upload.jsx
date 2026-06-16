import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaFileAudio, FaTrashAlt, FaArrowRight, FaSpinner, FaCheckCircle } from "react-icons/fa";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleBrowseClick = () => fileInputRef.current.click();

  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const handleDragEnter = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      const nameWithoutExt = droppedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }
  };

  const removeFile = () => { setFile(null); setTitle(""); };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (!file || !title) return alert("Please select a file and enter a title");
    try {
      setLoading(true);
      setUploadProgress(10);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("audio", file);
      formData.append("title", title);

      setUploadProgress(30);
      let res = await fetch("/api/lectures/upload", {
        method: "POST",
        headers: { token },
        body: formData,
      });
      let data = await res.json();

      if (!data.success && data.message && data.message.includes("No audio")) {
        setUploadProgress(40);
        const base64Audio = await convertToBase64(file);
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/lectures/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json", token },
          body: JSON.stringify({ audio: base64Audio, title }),
        });
        data = await res.json();
      }

      setUploadProgress(70);
      if (!data.success) return alert(data.message || "Upload failed");

      const lectureId = data.lecture._id;
      setUploadProgress(85);

      const processRes = await fetch(`${import.meta.env.VITE_API_URL}/api/lectures/process/${lectureId}`, {
        method: "POST",
        headers: { token },
      });
      const processData = await processRes.json();
      if (!processData.success) return alert(processData.message);

      setUploadProgress(100);
      setTimeout(() => navigate("/dashboard"), 400);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-surface-900">Upload Lecture</h1>
          <p className="text-sm text-surface-400 mt-0.5">Upload your lecture audio and let AI do the rest</p>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
            dragOver
              ? "border-brand-400 bg-brand-50/50 scale-[1.01]"
              : "border-surface-200 bg-surface-50/50 hover:border-surface-300"
          }`}
        >
          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center">
                  <FaCloudUploadAlt className="text-2xl text-brand-500" />
                </div>
                <div>
                  <p className="text-surface-700 font-medium">Drag & drop your lecture audio here</p>
                  <p className="text-sm text-surface-400 mt-1">or click to browse files</p>
                </div>
                <button type="button" onClick={handleBrowseClick}
                  className="bg-brand-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-all cursor-pointer shadow-md shadow-brand-500/20">
                  Browse Files
                </button>
                <p className="text-xs text-surface-400">MP3, WAV, M4A &bull; Up to 1GB (5+ hours)</p>
              </motion.div>
            ) : (
              <motion.div key="file" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center">
                  <FaFileAudio className="text-2xl text-brand-500" />
                </div>
                <div>
                  <p className="text-surface-800 font-medium">{file.name}</p>
                  <p className="text-sm text-surface-400">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                </div>
                <button onClick={removeFile} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer">
                  <FaTrashAlt /> Remove file
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title + Upload */}
        <AnimatePresence>
          {file && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Lecture Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your lecture"
                  className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 bg-surface-50 placeholder-surface-400 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
              </div>

              {/* Progress */}
              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500 flex items-center gap-2">
                      {uploadProgress >= 100 ? (
                        <FaCheckCircle className="text-emerald-400" />
                      ) : (
                        <FaSpinner className="animate-spin text-brand-500" />
                      )}
                      {uploadProgress < 70 ? "Uploading to cloud..." : uploadProgress < 85 ? "Processing..." : "Starting transcription..."}
                    </span>
                    <span className="text-surface-400 font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-surface-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleUpload}
                disabled={loading}
                className="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm active:scale-[0.99]"
              >
                {loading ? (
                  <><FaSpinner className="animate-spin" /> {uploadProgress >= 100 ? 'Redirecting...' : 'Uploading...'}</>
                ) : (
                  <><FaArrowRight /> Upload & Process</>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Upload;
