import React, { useState } from 'react'
import { NavLink } from "react-router-dom"
import SettingsModal from './SettingsModal'
import { MdSpaceDashboard } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoSettingsSharp, IoLogOutOutline } from "react-icons/io5";
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/Logo.png"

const SideBar = () => {
  const [settings, setSettings] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-brand-50 text-brand-700 shadow-sm border border-brand-100"
        : "text-surface-500 hover:bg-surface-100 hover:text-surface-700"
    }`;

  const iconClass = "text-lg";

  return (
    <aside className="w-56 min-h-screen bg-surface-50 border-r border-surface-100 px-3 py-6 flex flex-col gap-1 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-3 pb-5 mb-4 border-b border-surface-100">
        <img src={logo} className="w-8 h-8" alt="Lecturely" />
        <span className="text-lg font-bold text-surface-800 tracking-tight">Lecturely</span>
      </div>

      {/* Nav */}
      <NavLink to="/dashboard" className={linkClass} end>
        <MdSpaceDashboard className={iconClass} />
        Dashboard
      </NavLink>
      <NavLink to="/upload" className={linkClass}>
        <FaCloudUploadAlt className={iconClass} />
        Upload
      </NavLink>

      <button
        onClick={() => setSettings(true)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-all duration-200 w-full text-left cursor-pointer"
      >
        <IoSettingsSharp className={iconClass} />
        Settings
      </button>

      {/* Spacer + User + Sign out */}
      <div className="mt-auto">
        {user && (
          <div className="flex items-center gap-3 px-3 pb-4 mb-4 border-b border-surface-100">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
              {user.name?.[0] || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-surface-800 truncate">{user.name}</p>
              <p className="text-xs text-surface-400 truncate">{user.email || ''}</p>
            </div>
          </div>
        )}
        <div className="pt-4 border-t border-surface-100">
          <button
          onClick={() => { logoutUser(); navigate("/login"); }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 w-full text-left cursor-pointer"
        >
          <IoLogOutOutline className="text-lg" />
          Sign Out
        </button>
        </div>
      </div>

      <SettingsModal isOpen={settings} onClose={() => setSettings(false)} />
    </aside>
  )
}

export default SideBar
