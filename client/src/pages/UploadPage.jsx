import React from 'react'
import logo from "../assets/Logo.png"
import SideBar from '../components/SideBar'
import Upload from '../components/Upload'



const Dashboard = () => {
  return (
    <div>
        
        <div className="flex justify-between my-0 items-center bg-white sticky top-0 z-50 max-w-7xl px-6 py-3 min-w-screen " >
                <div className="flex gap-2 items-center">
                    <img src={logo} className="w-15 h-15"/>
                    <p className="text-gray-700 text-lg  font-bold">NoteGenie</p>
                </div>
    
            </div>
   <div className="flex flex-row" >
    <SideBar />   
    <Upload />     
        </div>
    </div>

    
  )
}

export default Dashboard