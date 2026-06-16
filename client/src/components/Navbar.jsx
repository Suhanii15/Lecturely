import React from 'react'
import logo from "../assets/Logo.png"
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("About")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="flex justify-between items-center bg-surface-50/80 backdrop-blur-xl sticky top-0 z-50 border-b border-surface-100/80 px-6 py-3.5">
      <div className="flex gap-2.5 items-center">
        <img src={logo} className="w-9 h-9" alt="Lecturely" />
        <span className="text-surface-800 text-lg font-bold tracking-tight">Lecturely</span>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={scrollToAbout}
          className="text-sm font-medium text-surface-500 px-4 py-2 rounded-lg hover:bg-surface-100 hover:text-surface-700 transition-colors cursor-pointer">
          About
        </button>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center text-sm font-semibold shadow-sm">
              {user.name?.[0] || 'U'}
            </div>
            <button onClick={() => { logoutUser(); navigate("/"); }}
              className="text-sm font-medium text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
              Logout
            </button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/login")}
            className="bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20 cursor-pointer">
            Sign In
          </motion.button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
