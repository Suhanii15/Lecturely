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

  const handleDeleteLecture = async (lectureId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete(
      `http://localhost:5000/api/lectures/${lectureId}`,
      {
        headers: { token },
      }
    );

    if (res.data.success) {
      // update UI instantly
      setLectures((prev) =>
        prev.filter((lecture) => lecture._id !== lectureId)
      );
    } else {
      alert(res.data.message);
    }
  } catch (error) {
    console.error("Delete failed", error);
    alert("Failed to delete lecture");
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
    lecture.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="p-6">Loading lectures...</p>;
  }


  return (
   <div className="flex flex-col">
    <div className="flex flex-row justify-between border border-gray-200 items-center bg-white z-0 min-w-7xl px-3 py-3">
      
       <h1 className="text-gray-700 font-bold text-2xl px-2 py-4"> Your Lectures</h1>
    </div>

    

<div className="flex min-h-screen flex-col gap-1 py-2 px-2 bg-white">
        {filteredLectures.length === 0 ? (
          <p className="text-gray-400 text-center mt-6">
            No lectures found
          </p>
        ) : (
          filteredLectures.map((lecture) => (
            <LectureCard key={lecture._id} lecture={lecture} onDelete={handleDeleteLecture} />
          ))
        )}
      </div>

    </div>
  )
}

export default Dashboard