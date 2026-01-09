import React from 'react'
import {useNavigate} from 'react-router-dom'

const LectureCard = ({lecture, onDelete}) => {
const navigate=useNavigate();


const handleViewNotes = () => {

    navigate(`/notes/${lecture._id}` , { state: {lectureData : lecture}});

  };

  const statusStyles = {
    uploaded: "bg-gray-100 text-gray-700 border border-gray-300",
    processing: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    completed: "bg-green-100 text-green-700 border border-green-300",
  };
const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lecture?"
    );
    if (!confirmDelete) return;

    onDelete(lecture._id);
  };
const displayTitle = lecture.title;


  return (
    <div className='border border-gray-200 my-5 shadow-sm bg-iwhite flex flex-row justify-between'>
        <div className="flex flex-col px-4 py-3  gap-1">
            <h3 className="text-gray-700 font-semibold" >{displayTitle}</h3>
            <h5 className="text-gray-400">{new Date(lecture.createdAt).toLocaleDateString()}</h5>

        </div>
        <div className="flex items-center gap-4">
        <span
          className={`px-4 py-2 rounded-full text-sm ${statusStyles[lecture.status]}`}
        >
          {lecture.status}
        </span>

        <button onClick={handleViewNotes}
        disabled={lecture.status != "completed"}
         className={`text-white px-4 py-2 mx-3 rounded-md transition ${
            lecture.status !== "completed" ? "bg-gray-700 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-500 cursor-pointer"
         }`}>
          View Notes
        </button>

         <button
          onClick={handleDelete}
          disabled={lecture.status === "processing"}
          className={`px-4 mx-3 py-2 rounded-md text-white ${
            lecture.status === "processing"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-400 hover:bg-red-500 cursor-pointer"
          }`}
        >
          Delete
        </button>
      </div>

    </div>
  )
}

export default LectureCard