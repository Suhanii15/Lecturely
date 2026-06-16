import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import Notes from './pages/Notes'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const PageWrapper = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-50 overflow-x-hidden">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/upload" element={<PageWrapper><UploadPage /></PageWrapper>} />
          <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
          <Route path="/notes/:lectureId" element={<PageWrapper><Notes /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
