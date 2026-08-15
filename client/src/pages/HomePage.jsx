import React from 'react'
import Navbar from '../components/Navbar'
import ai from "../assets/Ai.png"
import notes from "../assets/notes.png"
import upload from "../assets/upload.png"
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Mic, Brain, StickyNote, ArrowRight } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.08 * i, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const go = () => navigate(user ? "/dashboard" : "/login");

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex flex-col bg-surface-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl"
          >
            

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-surface-900 tracking-tight leading-tight">
              Turn Lecture Recordings into{' '}
              <span className="text-brand-600">
                Clear Notes
              </span>
            </h1>

            <p className="mt-5 text-lg text-surface-500 max-w-xl mx-auto leading-relaxed">
              Upload your lecture audio and get structured notes, summaries, and key points in seconds — powered by AI.
            </p>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={go}
              className="mt-8 bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-xl shadow-brand-500/25 cursor-pointer text-base inline-flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="text-sm" />
            </motion.button>

           
          </motion.div>
        </div>
      

      {/* How It Works */}
      
            
                
      </section>

      
      
              

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-surface-400 border-t border-surface-100 bg-surface-50">
        &copy; {new Date().getFullYear()} Lecturely. All rights reserved.
      </footer>
    </>
  )
}

export default HomePage
