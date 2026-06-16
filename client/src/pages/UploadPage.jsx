import React from 'react'
import SideBar from '../components/SideBar'
import Upload from '../components/Upload'

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="flex">
        <SideBar />
        <Upload />
      </div>
    </div>
  )
}

export default UploadPage
