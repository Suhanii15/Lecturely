import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from'./pages/HomePage'
import LoginPage from './pages/LoginPage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import Notes from './pages/Notes'

const App = () => {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      <Routes>
    <Route path='/' element= {<HomePage  /> }/>
    <Route path='/login' element= {<LoginPage  /> }/>
    <Route path='/upload' element= {<UploadPage  /> }/>
    <Route path='/dashboard' element= {<DashboardPage  /> }/>
<Route path="/notes/:lectureId" element={<Notes />} />

</Routes> </div>
  )
}

export default App