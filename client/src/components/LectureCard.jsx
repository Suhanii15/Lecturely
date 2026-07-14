import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from "../api";
import { motion } from 'framer-motion'
import { Mic, FileText, CheckCircle, Clock, Loader2, ArrowRight, Trash2, Pencil, Check, X } from "lucide-react"

const statusConfig = {
  completed: { icon: CheckCircle, label: "Completed", classes: "bg-emerald-400 text-white " },
  processing: { icon: Loader2, label: "Processing", classes: "bg-yellow text-white" },
  uploaded: { icon: Clock, label: "Awaiting", classes: "bg-sky-500 text-white" },
};

const LectureCard = ({ lecture, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(lecture.title || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const status = statusConfig[lecture.status] || statusConfig.uploaded;
  const Icon = status.icon;

  const handleSave = async () => {
    if (!newTitle.trim() || newTitle === lecture.title) {
      setIsEditing(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.put(
        `/api/lectures/${lecture._id}`,
        { title: newTitle.trim() },
        { headers: { token } }
      );
      if (data.success) {
        onUpdate(data.lecture);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleCancel = () => {
    setNewTitle(lecture.title || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    const confirmed = window.confirm("Are you sure you want to delete this lecture?");
    if (!confirmed) return;
    setIsDeleting(true);
    await onDelete(lecture._id);
    setIsDeleting(false);
  };

  const createdDate = lecture.createdAt
    ? new Date(lecture.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative bg-white-100 border border-zinc-400 rounded-xl hover:border-surface-700 transition-all duration-200 overflow-hidden"
    >
      <div className="p-3 md:p-5 flex items-center gap-2 md:gap-4 flex-wrap md:flex-nowrap">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                className="flex-1 bg-surface-200 border border-surface-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-surface-900 outline-none focus:border-brand-500/40"
              />
              <button onClick={handleSave} className="p-1.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-surface-600 transition-colors cursor-pointer"><Check className="text-[10px]" /></button>
              <button onClick={handleCancel} className="p-1.5 rounded-lg bg-surface-200 hover:bg-surface-300 text-surface-600 transition-colors cursor-pointer"><X className="text-[10px]" /></button>
            </div>
          ) : (
            <h3 className="text-sm font-bold text-surface-900 truncate leading-tight">{lecture.title || "Untitled"}</h3>
          )}
          <div className="flex items-center gap-2.5 mt-1.5">
            <span className="text-[11px] text-surface-500">{createdDate}</span>
            <span className="text-surface-300">·</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${status.classes}`}>
              <Icon className={`text-[9px] ${lecture.status === "processing" ? "animate-spin" : ""}`} />
              {status.label}
            </span>
            {lecture.progressMessage && lecture.status === "processing" && (
              <>
                <span className="text-surface-300">·</span>
                <span className="text-[11px] text-surface-500 truncate min-w-0 max-w-[120px] md:max-w-[200px]">{lecture.progressMessage}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 w-full sm:w-auto ml-auto sm:ml-0 sm:justify-end mt-2 sm:mt-0">
          {lecture.status === "completed" ? (
            <button
              onClick={() => navigate(`/notes/${lecture._id}`)}
              className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-all duration-200 cursor-pointer whitespace-nowrap shadow-lg shadow-brand-500/20"
            >
              Notes
              <ArrowRight className="text-[9px]" />
            </button>
          ) : (
            <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-surface-200 text-surface-400 text-xs font-semibold cursor-not-allowed select-none whitespace-nowrap">
              {lecture.status === "processing" ? "Processing" : "Queued"}
            </span>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 md:p-2 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-surface-200 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Rename"
          >
            <Pencil className="text-[10px] md:text-xs" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || lecture.status === "processing"}
            className="p-1.5 md:p-2 rounded-xl text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Delete"
          >
            <Trash2 className="text-[10px] md:text-xs" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default LectureCard
