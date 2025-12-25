import React, { useContext } from 'react'
import logo from "../assets/Logo.png"
import SideBar from '../components/SideBar'
import Dashboard from '../components/Dashboard'
import {AuthContext} from "../context/AuthContext"


const DashboardPage = () => {

  const {user} = useContext(AuthContext);
  return (
    <div>
        <div className="flex justify-between my-0 items-center bg-white sticky top-0 z-50 max-w-7xl px-6 py-3 min-w-screen " >
                        <div className="flex gap-2 items-center">
                            <img src={logo} className="w-15 h-15"/>
                            <p className="text-gray-700 text-lg  font-bold">NoteGenie</p>
                        </div>
                        <div>

                           {user && (
        <div className="flex items-center px-1 gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold">
            {user.name[0]}
          </div>
          <p className="text-gray-700 font-medium">{user.name}</p>
        </div>
      )}


   </div>
            
                    </div>

                    <div className="flex flex-row" >
    <SideBar />   
    <Dashboard />     
        </div>
    </div>
  )
}

export default DashboardPage