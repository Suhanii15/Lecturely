import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaTimes, FaEnvelope, FaBookOpen, FaSignOutAlt, FaSave } from "react-icons/fa";

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [notesPreference, setNotesPreference] = useState("paragraph");
  const [loading, setLoading] = useState(false);

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
      await axios.put("/api/user/preferences", { email, notesPreference }, { headers: { token } });
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-50 w-full max-w-md rounded-2xl shadow-xl border border-surface-100 overflow-hidden animate-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-surface-100">
          <div>
            <h2 className="text-lg font-bold text-surface-900">Settings</h2>
            <p className="text-sm text-surface-400 mt-0.5">Manage your preferences</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500 hover:bg-surface-200 transition-colors cursor-pointer">
            <FaTimes className="text-xs" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-surface-700 mb-2">
              <FaEnvelope className="text-surface-400" />
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
              <FaBookOpen className="text-surface-400" />
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
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
            <div className="flex items-center gap-3">
              <FaSignOutAlt className="text-red-400" />
              <div>
                <p className="text-sm font-semibold text-red-600">Account</p>
                <p className="text-xs text-red-400">Sign out of your session</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="text-xs font-bold text-red-500 border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer">
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
            {loading ? <><FaSave className="animate-spin" /> Saving...</> : <><FaSave /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
