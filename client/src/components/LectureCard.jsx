import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

const LectureCard = ({lecture, onDelete, onUpdate}) => {
const navigate=useNavigate();
const [isEditing, setIsEditing] = useState(false);
const [editedTitle, setEditedTitle] = useState(lecture.title || '');
const [isSaving, setIsSaving] = useState(false);


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
        <div className="flex items-center">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="border border-gray-200 px-2 py-1 rounded-md"
              />
              <button
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  if (!editedTitle || !editedTitle.trim()) {
                    alert('Title cannot be empty');
                    return;
                  }
                  try {
                    setIsSaving(true);
                    const { data } = await axios.put(
                      `/api/lectures/${lecture._id}/title`,
                      { title: editedTitle.trim() },
                      { headers: { token } }
                    );
                    if (data.success) {
                      setIsEditing(false);
                      if (onUpdate) onUpdate(data.lecture);
                    } else {
                      alert(data.message || 'Failed to update title');
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Failed to update title');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="px-2 py-1 bg-green-500 text-white rounded-md hover:cursor-pointer  transition"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : '✓'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(lecture.title || '');
                }}
                className="px-2 py-1 bg-gray-200 rounded-md hover:cursor-pointer  transition"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer px-2"
              title="Edit title"
            >
              ✎
            </button>
          )}
        </div>
        <span
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${statusStyles[lecture.status]}`}
        >
          {lecture.status === "processing" && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {lecture.status === "processing" && lecture.progressMessage
            ? lecture.progressMessage
            : lecture.status}
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