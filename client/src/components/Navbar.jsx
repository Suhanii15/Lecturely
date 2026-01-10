import React from 'react'
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import login from "../pages/LoginPage"
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const Navbar = () => {
const Navigate=useNavigate();
const { user, logoutUser } = useContext(AuthContext);


const scrollToAbout = () => {
   
    const aboutSection = document.getElementById("About")
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" })
    }
  }


  return (
    <div className="flex justify-between items-center bg-white sticky top-0 z-50 max-w-7xl  px-6 py-3 min-w-screen " >
        <div className="flex gap-2 items-center">
            <img src={logo} className="w-15 h-15"/>
            <p className="text-gray-700 text-lg  font-bold">Lecturely</p>
        </div>

        <div className="flex gap-6 items-center ">
            <button onClick={scrollToAbout}
             className="border-1 border-gray-700 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition ">About</button>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Hi, {user.name}</span>
                <button
                  onClick={() => {
                    logoutUser();
                    Navigate("/");
                  }}
                  className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-400 cursor-pointer transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={()=>Navigate("/login")}
              className="bg-violet-600 text-white-500 rounded-md px-4 py-2 hover:bg-violet-500 cursor-pointer transition border-rounded">Login</button>
            )}

        </div>
    </div>
  )
}

export default Navbar