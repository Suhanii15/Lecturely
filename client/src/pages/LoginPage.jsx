import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from "../assets/Logo.png"

const LoginPage = () => {
  const Navigate=useNavigate();

const[currState, setcurrState]=useState("Sign Up")
  const[name, setName]=useState("");
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const[isDataSubmitted, setIsDataSubmitted]=useState(false);


  const onSubmitHandler=(event)=>{
  event.preventDefault();
  if(currState === "Sign Up" && !isDataSubmitted){
    setIsDataSubmitted(true)
    Navigate("/UploadPage")
  }
  } 
  return (
    <div className="min-h-screen flex flex-col gap-8 items-center bg-slate-50">
<div className="flex justify-between my-0 items-center bg-white sticky top-0 z-50 max-w-7xl px-6 py-3 min-w-screen " >
        <div className="flex gap-2 items-center">
            <img src={logo} className="w-15 h-15"/>
            <p className="text-gray-700 text-lg  font-bold">NoteGenie</p>
        </div>

        <div className="flex gap-6 items-center ">
     <button onClick={()=>Navigate("/")}
            className="bg-violet-600 text-white-500 rounded-md px-4 py-2 hover:bg-violet-500 cursor-pointer transition border-rounded">Home</button>

        </div>
    </div>

      <form onSubmit={onSubmitHandler}
       className="bg-white rounded-lg shadow-md px-8 py-8 flex flex-col gap-6 hover:shadow-lg cursor-pointer transition">
        <h1 className=" font-md font-bold text-xl text-gray-700">{currState}</h1>
        {
          currState === 'Sign Up' &&  !isDataSubmitted && (
            
            <input onChange={(e)=>setName(e.target.value)} type="text" placeholder='Full Name' value={name}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition"/>

            
          )
        }
        
      {  !isDataSubmitted  && (
        <>
        <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email' value={email}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition"/>
        <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' value={password}  className="w-full mb-4 px-3 py-2 border border-gray-200 ronded-md hover:cursor-pointer transition"/>
        </>
      )
      }
<button type="submit" className="mt-8 rounded-md  bg-violet-600 text-white px-8 py-3 hover:bg-violet-500 cursor-pointer transition">
  { currState==="Sign Up" ? "Create Account" : "Login"}
</button>
<div className="flex flex-col gap-2">
  {
    currState === "Sign Up" ? (
      <p className="text-sm text-gray-700">Already Have an Account? <span
      onClick={()=>{setcurrState("Login"); setIsDataSubmitted(false)}}
      className="font-medium text-violet-500 cursor-pointer">Login Here</span></p>
    ) : (
      <p className="text-sm text-gray-700">Create an account.<span
      onClick={()=>setcurrState("Sign Up")}
      className="font-medium text-violet-500 cursor-pointer">Click Here</span></p>
    )
  } 
</div>
  

      </form>

      
    </div>
  )
}

export default LoginPage