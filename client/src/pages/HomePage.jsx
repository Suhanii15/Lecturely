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
      <div id ="About" className="px-6 py-24 bg-surface-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-100 text-surface-600 border border-surface-200 mb-4">
              How it works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900">Three simple steps</h2>
            <p className="text-surface-500 mt-3 max-w-md mx-auto">From recording to notes in minutes.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { img: upload, icon: Mic, title: "Upload Lecture", desc: "Upload your lecture recording or audio file in any common format.", delay: 0 },
              { img: ai, icon: Brain, title: "AI Processing", desc: "Our AI transcribes and understands your lecture content with high accuracy.", delay: 0.15 },
              { img: notes, icon: StickyNote, title: "Get Smart Notes", desc: "Receive clean notes, summaries, and key takeaways instantly.", delay: 0.3 },
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={item.delay}
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={go}
                className="bg-surface-100 rounded-2xl border border-surface-200 p-8 text-center shadow-sm hover:shadow-xl hover:shadow-brand-500/5 hover:border-brand-200/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 group-hover:scale-105 transition-all duration-300">
                  <item.icon className="text-xl text-brand-500" />
                </div>
                <div className="w-20 h-20 mx-auto mb-5 hidden">
                  <img src={item.img} className="w-full h-full object-contain" alt={item.title} />
                </div>
                <h3 className="text-lg font-bold text-surface-800 mb-2">{item.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </section>

      
      
              

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-surface-400 border-t border-surface-100 bg-surface-50">
        &copy; {new Date().getFullYear()} Lecturely. All rights reserved.
      </footer>
    </>
  )
}

export default HomePage
