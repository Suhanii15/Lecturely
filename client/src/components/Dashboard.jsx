import React, { useState, useContext } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import LectureCard from './LectureCard';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { FaMicrophone, FaCheckCircle, FaSpinner, FaPlus, FaSearch } from "react-icons/fa";

const container = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeSlideUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchLectures = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/lectures/", { headers: { token } });
      if (data.success) setLectures(data.lectures);
    } catch (error) {
      console.error("Error fetching lectures", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`/api/lectures/${lectureId}`, { headers: { token } });
      if (res.data.success) {
        setLectures((prev) => prev.filter((lecture) => lecture._id !== lectureId));
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete lecture");
    }
  };

  const handleUpdateTitle = (updatedLecture) => {
    setLectures((prev) =>
      prev.map((lec) => (lec._id === updatedLecture._id ? updatedLecture : lec))
    );
  };

  useEffect(() => {
    fetchLectures();
    const interval = setInterval(() => fetchLectures(), 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLectures = lectures.filter((lecture) =>
    lecture.title?.toLowerCase().includes(search.toLowerCase())
  );

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="flex-1 p-6 md:p-8 lg:p-10 max-w-6xl">

      {/* Hero header */}
      <motion.div variants={fadeSlideUp} className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900">
              {greeting}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/upload")}
            className="bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 cursor-pointer flex items-center gap-2 shrink-0"
          >
            <FaPlus className="text-[10px]" />
            New Upload
          </motion.button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeSlideUp} className="mb-8 max-w-md">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-sm pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your lectures..."
            className="w-full pl-11 pr-4 py-3 bg-surface-100 border border-surface-200 rounded-2xl text-sm text-surface-900 placeholder-surface-500 outline-none focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10 transition-all duration-200"
          />
        </div>
      </motion.div>

      {/* Lecture list */}
      <motion.div variants={fadeSlideUp}>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-100 rounded-2xl border border-surface-200 p-5">
                <div className="flex items-center gap-4">
                  <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-48" />
                    <div className="skeleton h-3 w-32" />
                  </div>
                  <div className="skeleton h-8 w-24 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredLectures.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-surface-100 flex items-center justify-center border border-surface-200">
              {search ? <FaSearch className="text-surface-400 text-xl" /> : <FaMicrophone className="text-surface-400 text-xl" />}
            </div>
            <h3 className="text-lg font-bold text-surface-900 mb-1">
              {search ? "No results found" : "No lectures yet"}
            </h3>
            <p className="text-sm text-surface-500 mb-6 max-w-xs mx-auto">
              {search
                ? `No lectures match "${search}". Try a different search term.`
                : "Upload your first lecture and let AI turn it into structured notes."}
            </p>
            {!search && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/upload")}
                className="bg-brand-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 cursor-pointer inline-flex items-center gap-2"
              >
                <FaPlus className="text-[10px]" />
                Upload Your First Lecture
              </motion.button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                {filteredLectures.length} lecture{filteredLectures.length > 1 ? 's' : ''}
              </p>
            </div>
            {filteredLectures.map((lecture) => (
              <LectureCard key={lecture._id} lecture={lecture} onDelete={handleDeleteLecture} onUpdate={handleUpdateTitle} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick action cards when no lectures */}
      {!loading && lectures.length === 0 && (
        <motion.div variants={fadeSlideUp} className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: FaMicrophone, title: "Upload Audio", desc: "MP3, WAV, M4A — up to 1GB", color: "text-brand-500 bg-brand-500/10" },
            { icon: FaSpinner, title: "AI Processing", desc: "Transcription & summarization", color: "text-amber-400 bg-amber-500/10" },
            { icon: FaCheckCircle, title: "Get Notes", desc: "Structured chapters & key points", color: "text-emerald-400 bg-emerald-500/10" },
          ].map((item, i) => (
            <div key={i} className="bg-surface-100 border border-surface-200 rounded-2xl p-5 text-center">
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3 text-base`}>
                <item.icon />
              </div>
              <h4 className="text-sm font-bold text-surface-900 mb-0.5">{item.title}</h4>
              <p className="text-xs text-surface-500">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default Dashboard
