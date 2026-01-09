import React, { useState } from 'react'
import {NavLink} from "react-router-dom"
import SettingsModal from './SettingsModal';
import { MdSpaceDashboard } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";



const SideBar = () => {

  const[settings, setSettings]=useState(false);


  return (
<div className="w-54 min-h-screen bg-slate-90  px-6 py-8">
      <ul className="space-y-5 text-gray-700">
    
        <NavLink to="/dashboard" className={ ({isActive})=>` block px-2 py-2 shodow-sm flex gap-2 cursor-pointer ${isActive ? 
          "bg-violet-500 border border-black rounded-md text-gray-700 font-semibold " : " rounded-md shadow-md"}`}  >
            <MdSpaceDashboard className=" my-auto" />
            Dashboard </NavLink>
      
            <NavLink to="/upload" className={ ({isActive})=>` block px-2 py-2 shodow-sm flex gap-2 cursor-pointer ${isActive ? 
          "bg-violet-500 border border-black rounded-md text-gray-700 font-semibold " : " rounded-md shadow-md"}`}  >
            <FaCloudUploadAlt className=" my-auto"/>
            Upload Lecture </NavLink>
             <button onClick={()=>setSettings(true)}
              className="px-2 py-2 shadow-sm cursor-pointer w-full rounded-md flex gap-3 font-semibold hover:bg-violet-500 cursor-pointer text-gray-700">
                <IoSettingsSharp className="my-auto" />

            Settings </button>
            <SettingsModal isOpen={settings} onClose={()=>setSettings(false)}/>
          </ul>

    </div>  )
}

export default SideBar