import React from 'react'
import Navbar from '../components/Navbar'
import ai from "../assets/Ai.png"
import notes from "../assets/notes.png"
import upload from "../assets/upload.png"
import { motion } from 'framer-motion' // Added for smooth animations
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate=useNavigate();
const cardVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.9, 
      z: 0 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      // Continuous floating effect
      y: [0, -10, 0],
      transition: {
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    hover: { 
      scale: 1.1, // Move toward user
      rotateX: 10, // Tilt backward slightly for 3D perspective
      rotateY: -5,
      z: 100, // Move forward in 3D space
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

 

  return (
    <>
    <section className="h-[calc(100vh-64px)] min-w-screen flex flex-col bg-slate">
 <Navbar/>
<div className="flex-1 flex flex-col gap-2 px-2  items-center justify-center">
    <motion.h1 initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
    className="text-gray-700 text-4xl font-bold font-weight-500">
        Turn Lecture Recordings into Clear Notes using AI
    </motion.h1>
    <p className="text-gray-700 text-base py-4 font-weight-100"> 
        Upload your lecture audio and get structured notes, summaries and key points in seconds
    </p>
    <motion.button onClick={()=>navigate("/login")}
            whileHover={{ scale: 1.1, z: 50 }}
            whileTap={{ scale: 0.9 }} 
            className="mt-8 rounded-md  bg-violet-600 text-white px-8 py-3 hover:bg-violet-500 cursor-pointer transition" >Get Started
</motion.button>

</div>

    </section>

{/* ABOUT SECTION (SCROLL DOWN) */}
      <section id="About" className="bg-white py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            About
          </h2>

          <p className="text-gray-600 max-w-3xl mx-auto">
            NoteGenie helps students convert lecture recordings into clean, structured notes
            using AI — saving time and improving understanding.
          </p>

        </div>
      </section>

<section className="px-5 py-5 bg-slate-50">
    <h1 className="text-3xl text-center mt-4 px-2 font-bold text-gray-700 mb-4">How it works</h1>
    <div className=" max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

<motion.div  
variants={cardVariants}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true }}
            onClick={()=>navigate("/Upload")}
 className="bg-white rounded-lg shadow-sm tecxt-center py-6 hover:shadow-lg cursor-pointer transition ">
    <img src={upload} className="h-50 w-50 mx-auto mb-4" />
    <h4 className="text-gray-800 text-md text-center font-weight-600 text-bold ">Upload Lecture</h4>
    <p className="text-center mt-3 text-gray-500 ">  Upload your lecture recording or audio here</p>

</motion.div>
<motion.div 
variants={cardVariants}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true }}
   className="bg-white  rounded-lg shadow-sm text-center py-6 hover:shadow-lg cursor-pointer transition ">
    <img src={ai} className="h-50 w-50 mx-auto mb-4 "/>
    <h4 className="text-gray-800 text-md text-center font-weight-600 text-bold ">AI Processing</h4>
    <p className="text-center mt-3 text-gray-500 ">Our AI transcribes and understand your lecture content</p>

</motion.div>
<motion.div variants={cardVariants}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true }}
 className="bg-white rounded-lg shadow-sm text-center py-6 hover:shadow-lg cursor-pointer transition ">
    <img src={notes} className="h-50 w-50 mx-auto mb-4" />
    <h4 className="text-gray-800 text-md text-center font-weight-600 text-bold ">Get Smart Notes</h4>
    <p className="text-center mt-3 text-gray-500 ">Receive Clean notes, summaries and key takeaways instantly.</p>

</motion.div>
    </div>

</section>

    </>
  )

}

export default HomePage