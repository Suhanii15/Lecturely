import React, { useState } from 'react'
import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import LectureCard from './LectureCard';
import { FaSearch } from "react-icons/fa";


const Dashboard = () => {

    const[search,setSearch]=useState("");
    const lectures = [
    {
      id: 1,
      title: "Computer Networks",
      date: "April 24, 2024",
      status: "Processing",
      notes : ""
    },
    {
      id: 2,
      title: "Database Management Systems",
      date: "April 22, 2024",
      status: "Completed",
      notes : "Fourth sem meajor topic"

    },
    {
      id: 3,
      title: "Machine Learning Basics",
      date: "April 20, 2024",
      status: "Completed",
      notes : ""

    },
  ];

  return (
   <div className="flex flex-col">
    <div className="flex flex-row justify-between border border-gray-200 items-center bg-white z-0 min-w-7xl px-3 py-3">
      
       <h1 className="text-gray-700 font-bold text-2xl px-2 py-4"> Your Lectures</h1>
    </div>

    <div className=" px-2 py-2 h-14 bg-white flex  align-center">
      <FaSearch className="flex alogn-center justify-center my-auto mx-auto h-5"/>
<input className="mx-auto my-auto py-2 px-3 w-300 border border-gray-200 hover:border-gray-400 cursor-pointer transition "
 type="text" placeholder="Search lecture" onChange={(e)=>setSearch(e.target.value)} value={search} /> 
    </div>

<div className="flex min-h-screen flex-col gap-1 py-2 px-2 bg-white">
    {lectures.map((lecture)=>(
<LectureCard key={lecture.id} lecture={lecture} />
    ))
}
</div>
    </div>
  )
}

export default Dashboard