import React, { useState } from 'react'
import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import LectureCard from './LectureCard';
import { FaSearch } from "react-icons/fa";
import axios from 'axios';

const Dashboard = () => {

    const[search,setSearch]=useState("");
    const  [lectures, setLectures]=useState([]);
    const [loading, setLoading]=useState(true);
  const fetchLectures = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "http://localhost:5000/api/lectures/",
        {
          headers: {
            token,
          },
        }
      );
 if (data.success) {
        setLectures(data.lectures);
      }
    } catch (error) {
      console.error("Error fetching lectures", error);
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
    fetchLectures();

    const intervel=setInterval(()=>{
      fetchLectures();
    }, 5000);

    return()=>clearInterval(intervel);
  }, []);

  const filteredLectures = lectures.filter((lecture) =>
    lecture.audioUrl?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="p-6">Loading lectures...</p>;
  }


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
        {filteredLectures.length === 0 ? (
          <p className="text-gray-400 text-center mt-6">
            No lectures found
          </p>
        ) : (
          filteredLectures.map((lecture) => (
            <LectureCard key={lecture._id} lecture={lecture} />
          ))
        )}
      </div>

    </div>
  )
}

export default Dashboard