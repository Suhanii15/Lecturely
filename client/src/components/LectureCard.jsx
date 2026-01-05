import React from 'react'
import {useNavigate} from 'react-router-dom'

const LectureCard = ({lecture}) => {
const navigate=useNavigate();
const handleViewNotes = () => {

    navigate(`/notes/${lecture.id}` , { state: {lectureData : lecture}});

  };
  return (
    <div className='border border-gray-200 my-5 shadow-sm bg-iwhite flex flex-row justify-between'>
        <div className="flex flex-col px-4 py-3  gap-1">
            <h3 className="text-gray-700 font-semibold" >{lecture.title}</h3>
            <h5 className="text-gray-400">{lecture.date}</h5>

        </div>
        <div className="flex items-center gap-4">
        <span
          className={`px-4 py-2 rounded-full text-sm ${
            lecture.status === "Completed"
              ? "bg-green-100 text-green-700 border border-green-800"
              : "bg-yellow-100 text-yellow-700 border border-yellow-100"
          }`}
        >
          {lecture.status}
        </span>

        <button onClick={handleViewNotes}
        disabled={lecture.status != "Completed"}
         className={`text-white px-4 py-2 mx-3 rounded-md transition ${
            lecture.status !== "Completed" ? "bg-gray-700 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-500 cursor-pointer"
         }`}>
          View Notes
        </button>
      </div>

    </div>
  )
}

export default LectureCard