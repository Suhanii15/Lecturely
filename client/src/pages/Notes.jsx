import React, {useState, useEffect} from 'react'
import logo from "../assets/Logo.png"
import SideBar from "../components/SideBar"
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Dashboard from './DashboardPage';
import jsPDF from "jspdf";
import {AuthContext} from "../context/AuthContext"
import {useContext} from 'react'
import axios from "axios";

const Notes = () => {

const {user} = useContext(AuthContext);
const {lectureId}=useParams();
const navigate=useNavigate();
const [lecture, setLecture] = useState(null);
const [notes, setNotes]=useState(null);
const [loading,setLoading]=useState(true);

useEffect(()=>{
  const fetchNotes = async ()=>{
    try{
      const token=localStorage.getItem("token");

      const {data}=await axios.get(`http://localhost:5000/api/notes/${lectureId}`,{
        headers:{
          token:localStorage.getItem("token"),
        }
        }
      );

      if(data.success){
        setNotes(data.notes);
        setLecture(data.lecture);
      }
    }
    catch(error){
      console.log(error.message);
    }
    finally{
      setLoading(false);
    }
  };
  if(lectureId){
  fetchNotes();
  }
}, [lectureId]);



 if (!lecture) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl">No data found for this lecture.</h2>
        <button onClick={() => navigate('/dashboard')} className="text-violet-600 underline mt-4 hover:cursor-pointer text-violet-500">
          Go to Dashboard
        </button>
      </div>
    );
   }

   const downloadpdf = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(lecture?.title || "Lecture Notes", 10, 20);

  doc.setFontSize(12);
  doc.text(lecture.notes, 10, 35, { maxWidth: 180 });

  doc.save(`${lecture.title || "notes"}.pdf`);
};

if(loading){
  return <p className="p-10"> Loading Notes...</p>
}
  return (
    <div>
        <div className="flex justify-between my-0 items-center bg-white sticky top-0 z-50 max-w-7xl px-6 py-3 min-w-screen " >
                                <div className="flex gap-2 items-center">
                                    <img src={logo} className="w-15 h-15"/>
                                    <p className="text-gray-700 text-lg  font-bold">NoteGenie</p>
                                </div>
                                 {user && (
        <div className="flex items-center px-1 gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold">
            {user.name[0]}
          </div>
          <p className="text-gray-700 font-medium">{user.name}</p>
        </div>
      )}
                                </div>


        <div className="flex flex-row" >
    <SideBar />   
 <div className="flex-1 px-8 py-6">

          {/* TITLE */}
          <h1 className="text-2xl font-bold text-gray-700 mb-2">
            {lecture.title}
          </h1>

          {/* STATUS */}
          <span className="inline-block mb-6 px-4 py-1 rounded-full text-sm bg-green-100 text-green-700">
            {lecture.status}
          </span>

          <button onClick={downloadpdf}
          className="bg-violet-500 px-4 py-2 mx-5 rounded-md text-white font-semibold shadow-sm hover:shadow-md cursor-pointer transition">Download pdf</button>

          {/* NOTES CARD */}
          <div className="bg-white rounded-lg shadow-md p-6">

            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Generated Notes
            </h3>

            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {notes.content}
               </p>

          </div>
        </div>
    </div>
    </div>
  )
}

export default Notes