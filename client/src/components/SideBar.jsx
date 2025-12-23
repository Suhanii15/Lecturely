import React from 'react'

const SideBar = () => {
  return (
<div className="w-54 min-h-screen bg-slate-90  px-6 py-8">
      <ul className="space-y-5 text-gray-700">
        <li className="px-2 py-2 shadow-sm hover:border border-violet-500 shadow-md rounded-md cursor-pointer">Dashboard</li>
        <li className="px-2 py-2 shadow-sm hover:border border-violet-500 shadow-md rounded-md cursor-pointer">
          Upload Lecture
        </li>
        <li className="px-2 py-2 shadow-sm hover:border border-violet-500 shadow-md rounded-md cursor-pointer">History</li>
        <li className="px-2 py-2 shadow-sm hover:border border-violet-500 shadow-md rounded-md cursor-pointer">Settings</li>
      </ul>

    </div>  )
}

export default SideBar