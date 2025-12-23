import React, { useRef, useState } from 'react'
import upload from "../assets/upload.png"


const Upload = () => {


    const [file,setFile]=useState(null);
      const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
const handleBrowseClick = () => {
    fileInputRef.current.click();
  };


  return (

    <div className="flex flex-col">
        <h1 className="text-gray-700 font-bold text-2xl px-2 py-4"> Upload Lecture</h1>
        <div className="mx-50 h-140 bg-white w-4xl h-104 rounded-lg shadow-md p-10">
            <div className='h-120 border border-dashed rounded-xl  border-violet-500 flex flex-col gap-2 items-center cursor-pointer'>

                <input   ref={fileInputRef} type="file" accept="audio/*" className="hidden cursor-pointer"  onChange={handleFileChange} />
                <img src={upload} className="h-80 py-2"/>
                 <p className="text-gray-600 mb-3">
          Drag & drop your lecture audio here, or
        </p>

        <button
          type="button"  onClick={handleBrowseClick}

          className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-500 cursor-pointer"
        >
          Browse Files
        </button>

        <p className="text-sm text-gray-400 mt-4">
          MP3, WAV, M4A • Up to 100MB
        </p>


            </div>

        </div>

        {file && (
        <p className="text-center mt-4 text-gray-700">
          Selected: <span className="font-medium">{file.name}</span>
        </p>
      )}

    </div>

  )
}

export default Upload