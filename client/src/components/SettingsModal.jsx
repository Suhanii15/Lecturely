import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import axios from "axios"
const SettingsModal = ({ isOpen, onClose}) => {

  const {  user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // Local state for the editable email
  const [email, setEmail] = useState("user@example.com");
  const [noteFormat, setNoteFormat] = useState("paragraph");
  const[loading, setLoading]=useState(false);

  useEffect(() => {
    if (user?.notesPreference) {
      setNoteFormat(user.notesPreference);
    }
  }, [user]);

const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/user/preferences",
        { notesPreference: noteFormat },
        {
          headers: { token },
        }
      );

      onClose();
    } catch (error) {
      console.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login'); // Redirect to login after clearing state
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 mx-4 border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="space-y-6">
          
          {/* 1. Note Format Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Preferred Note Format
            </label>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setNoteFormat("paragraph")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg hover: cursor-pointer transition ${noteFormat === "paragraph" ? "bg-white shadow-sm text-violet-600" : "text-gray-500"}`}
              >
                Paragraph
              </button>
              <button 
                onClick={() => setNoteFormat("keypoints")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg hover: cursor-pointer transition ${noteFormat === "keypoints" ? "bg-white shadow-sm text-violet-600" : "text-gray-500"}`}
              >
                Key Points
              </button>
            </div>
          </div>
          
          {/* 3. Contact Email (Editable) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contact Email
            </label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
              />
              <span className="absolute right-3 top-2.5 text-gray-400 text-xs">Edit</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">This email will be used for AI summary alerts.</p>
          </div>

<div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-red-600">Account</p>
              <p className="text-xs text-gray-400">Sign out of your session</p>
            </div>
            <button 
              onClick={handleLogout}
              className="text-xs font-bold text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
            >
              Logout
            </button>
          </div>


        </div>

        {/* Footer */}
        <div className="mt-8">
          <button 
            onClick={handleSave}
            className="w-full bg-violet-600 text-white font-bold py-3 rounded-xl hover:bg-violet-700 active:scale-[0.98] transition cursor-pointer"
          >
            {loading ? "Saving..." : "Save & Close"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;