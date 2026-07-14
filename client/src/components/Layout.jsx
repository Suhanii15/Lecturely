import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import SideBar from './SideBar';
import logo from "../assets/Logo.png";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-surface-100 bg-surface-50/80 backdrop-blur-xl sticky top-0 z-20">
        <button onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors cursor-pointer">
          <FaBars className="text-surface-500 text-sm" />
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} className="w-7 h-7" alt="Lecturely" />
          <span className="text-base font-bold text-surface-800 tracking-tight">Lecturely</span>
        </div>
        <div className="w-9" />
      </div>

      <div className="flex relative">
        {/* Sidebar wrapper */}
        <div className={`
          shrink-0
          fixed inset-y-0 left-0 z-40
          lg:static lg:z-auto
          transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <SideBar />
        </div>

        {/* Backdrop */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
