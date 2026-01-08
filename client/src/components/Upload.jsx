import React, { useRef, useState } from 'react'
import upload from "../assets/upload.png"
import { useNavigate } from 'react-router-dom';


const Upload = () => {
    const [file,setFile]=useState(null);
      const fileInputRef = useRef(null);
const [loading, setLoading]=useState(false);
const[title, setTitle]=useState("");
const navigate=useNavigate();

    const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (selectedFile) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }

  };
const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    try {
      setLoading(true);
      const base64Audio = await convertToBase64(file);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/lectures/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({ audio: base64Audio }),
      });

      const data = await res.json();

      if (!data.success) {
alert(data.message);
return;}
const lectureId=data.lecture._id;
await fetch(`http://localhost:5000/api/lectures/process/${lectureId}`, {
        method: "POST",
        headers: {token},
      });
    navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex flex-col">
        <h1 className="text-gray-700 font-bold text-2xl px-2 py-4"> Upload Lecture</h1>
        <div className="mx-50 h-140 bg-white w-4xl h-104 rounded-lg shadow-md p-10">
            <div className='h-120 border border-dashed rounded-xl  border-violet-500 flex flex-col gap-2 items-center cursor-pointer'>

                <input ref={fileInputRef} type="file" accept="audio/*" className="hidden cursor-pointer"  onChange={handleFileChange} />
                <img src={upload} className="h-80 py-2"/>
                 <p className="text-gray-600 mb-3">
        Upload your lecture audio here
        </p>

        <button
          type="button" onClick={handleBrowseClick}

          className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-500 cursor-pointer"
        >
          Browse Files
        </button>
{file && (
<>
   <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Lecture title"
                className="w-96 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500"
              />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-500"
            >
              {loading ? "Uploading..." : "Upload & Continue"}
            </button>
            </>
          )}

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