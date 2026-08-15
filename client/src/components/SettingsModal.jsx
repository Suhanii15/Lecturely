import React, { useState, useContext, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from "../api";
import { X, Mail, BookOpen, LogOut, Save } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }
};

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [notesPreference, setNotesPreference] = useState("paragraph");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.notesPreference) setNotesPreference(user.notesPreference);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.put("/api/user/preferences", { email, notesPreference }, { headers: { token } });
      onClose();
    } catch (error) {
      console.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-lg p-4"
          onClick={onClose}
        >
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-50 w-full max-w-md rounded-2xl shadow-xl border border-surface-100 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-surface-100">
              <div>
                <h2 className="text-lg font-bold text-surface-900">Settings</h2>
                <p className="text-sm text-surface-400 mt-0.5">Manage your preferences</p>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500 hover:bg-surface-200 transition-colors cursor-pointer">
                <X className="text-xs" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700 mb-2">
                  <Mail className="text-surface-400" />
                  Contact Email
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-surface-200 rounded-xl text-sm text-surface-900 bg-surface-50 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
                />
                <p className="text-xs text-surface-400 mt-1">Used for AI summary alerts</p>
              </div>

              {/* Notes format */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-surface-700 mb-3">
                  <BookOpen className="text-surface-400" />
                  Notes Format
                </label>
                <div className="flex gap-3">
                  {["paragraph", "keypoints"].map((opt) => (
                    <label key={opt} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      notesPreference === opt
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-surface-200 bg-surface-50 text-surface-500 hover:border-surface-300 hover:text-surface-700"
                    }`}>
                      <input type="radio" name="notesPreference" value={opt}
                        checked={notesPreference === opt}
                        onChange={(e) => setNotesPreference(e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium capitalize">{opt === "paragraph" ? "Paragraph" : "Key Points"}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Logout */}
              <div className="flex items-center justify-between p-4 rounded-xl ">
                <div className="flex items-center gap-3">
                  <LogOut className="text-garay-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">Account</p>
                    <p className="text-xs text-gray-400">Sign out of your session</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="text-xs font-bold text-gray-500 border border-gray-500/20 px-4 py-2 rounded-lg hover:bg-gray-500/10 transition-all cursor-pointer">
                  Logout
                </button>
              </div>
            </div>

            {/* Save */}
            <div className="px-6 pb-6 pt-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer transition-all text-sm active:scale-[0.99]"
              >
                {loading ? <><Save className="animate-spin" /> Saving...</> : <><Save /> Save Changes</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SettingsModal;
