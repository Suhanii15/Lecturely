import React from 'react'
import SideBar from '../components/SideBar'
import Dashboard from '../components/Dashboard'

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="flex">
        <SideBar />
        <Dashboard />
      </div>
    </div>
  )
}

export default DashboardPage
