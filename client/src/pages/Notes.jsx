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
const[isEditing, setIsEditing]=useState(false);
const[editedContent, setEditedContent]=useState("");
const [saving, setSaving]=useState(false);


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
        setEditedContent(data.notes.content);
        setLecture(data.lecture);
          setHighlights(data.notes.highlights || []);

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

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const title = lecture?.title || 'Lecture Notes';
    const body = notes?.content || '';

    doc.setFontSize(18);
    doc.text(title, 40, 60);

    doc.setFontSize(12);
    const lines = doc.splitTextToSize(body, 520);
    doc.text(lines, 40, 90);

    doc.save(`${title.replace(/[^a-z0-9\- ]/gi, '_')}.pdf`);
  };



  const downloadTxt = () => {
    const body = notes?.content || '';
    const blob = new Blob([body], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lecture?.title || 'notes'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };


  const saveNotes = async () => {
  try {
    setSaving(true);
    const { data } = await axios.put(
      `http://localhost:5000/api/notes/${notes._id}`,
      { content: editedContent },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    if (data.success) {
      setNotes({ ...notes, content: editedContent });
      setEditedContent(editedContent);
      setIsEditing(false);
    } else {
      console.error("Failed to save notes:", data.message);
      alert("Failed to save notes. Please try again.");
    }
  } catch (error) {
    console.error("Error saving notes:", error.message);
    alert("Error saving notes. Please try again.");
  } finally {
    setSaving(false);
  }
};

const handleHighlight = () => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // Prevent empty selection
  if (range.collapsed) return;

  // Ensure selection is inside notes
  const container = document.getElementById("notes-content");
  if (!container.contains(range.commonAncestorContainer)) return;

  const mark = document.createElement("mark");
  mark.style.backgroundColor = "#fde68a"; // yellow-300
  mark.style.padding = "2px";
  mark.style.borderRadius = "4px";

  range.surroundContents(mark);
  selection.removeAllRanges();

  // Save updated content
  setNotes(prev => ({
    ...prev,
    content: container.innerHTML
  }));
};

      

const handleRemoveHighlight = (e) => {
  const target = e.target;

  // Only act if clicking on highlighted text
  if (target.tagName !== "MARK") return;

  const parent = target.parentNode;
  const textNode = document.createTextNode(target.innerText);

  parent.replaceChild(textNode, target);

  // Merge adjacent text nodes (important!)
  parent.normalize();

  // Save updated content
  const container = document.getElementById("notes-content");
  setNotes(prev => ({
    ...prev,
    content: container.innerHTML
  }));
};

if(loading){
  return <p className="p-10"> Loading Notes...</p>
}
  return (
    <div>
        <div className="flex justify-between my-0 items-center bg-white sticky top-0 z-50 max-w-7xl px-6 py-3 min-w-screen " >
                                <div className="flex gap-2 items-center">
                                    <img src={logo} className="w-15 h-15"/>
                                    <p className="text-gray-700 text-lg  font-bold">Lecturely</p>
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

          <div className="flex gap-3 mb-4">
            <button  title="download in pdf format"
             onClick={downloadPdf}
              className="bg-violet-500 px-4 py-2 rounded-md text-white font-semibold shadow-sm hover:bg-violet-700 shadow-md cursor-pointer transition">PDF</button>
            <button title="download in txt format"
             onClick={downloadTxt}
              className="bg-violet-500 px-4 py-2 rounded-md text-white font-semibold shadow-sm hover:bg-violet-700 shadow-md cursor-pointer transition">TXT</button>
          </div>

          {/* NOTES CARD */}
          <div className="bg-white rounded-lg shadow-md p-6">
<div className="flex gap-2 mb-3">
  <button
    onClick={() => handleHighlight("yellow")}
    className="px-3 py-1 bg-yellow-300 rounded text-sm hover:bg-yellow-400 cursor-pointer  transition"
    title="Select text to highlight and click to remove!"
  >
    Highlight
  </button>


</div>

<div className="flex justify-between items-center mb-4">
  <h3 className="text-lg font-semibold text-gray-700">
    Generated Notes
  </h3>

  {!isEditing && (
    <button
      onClick={() => setIsEditing(true)}
      className="text-violet-500 hover:text-violet-700"
      title="Edit notes"
    >
      ✏️
    </button>
  )}
</div>


            {isEditing ? (
  <>
    <textarea
      value={editedContent}
      onChange={(e) => setEditedContent(e.target.value)}
      className="w-full min-h-[300px] border rounded-md p-3 text-gray-700 focus:outline-violet-500"
    />

    <div className="flex gap-3 mt-4">
      <button
        onClick={saveNotes}
        disabled={saving}
        className="bg-violet-500 px-4 py-2 rounded-md text-white font-semibold"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      <button
        onClick={() => {
          setEditedContent(notes.content);
          setIsEditing(false);
        }}
        className="bg-gray-200 px-4 py-2 rounded-md text-gray-700 font-semibold"
      >
        Cancel
      </button>
    </div>
  </>
) : (
 <div
  id="notes-content"
  className="text-gray-600 leading-relaxed whitespace-pre-line cursor-text"
  onMouseUp={handleHighlight}
  onClick={handleRemoveHighlight}
  dangerouslySetInnerHTML={{ __html: notes.content }}
/>


)}
</div>



{notes.chapters?.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Auto Chapters
              </h3>

              {notes.chapters.map((ch, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border rounded-md hover:bg-gray-50"
                >
                  <p className="font-semibold text-gray-800">
                    {index + 1}. {ch.headline}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {ch.summary}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    ⏱ {Math.floor(ch.start / 1000)}s –{" "}
                    {Math.floor(ch.end / 1000)}s
                  </p>
                </div>
              ))}
            </div>
          )}

          

        </div>
    </div>
    </div>
  )
}

export default Notes