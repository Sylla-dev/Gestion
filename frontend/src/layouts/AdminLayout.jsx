import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* OVERLAY pour fermer la sidebar sur mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
          aria-hidden="true"
        />
      )}

      {/* CONTENT */}
      <div className="flex-1 flex flex-col bg-base-100 transition-all duration-300 ease-in-out">
        {/* NAVBAR */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* CORPS PRINCIPAL */}
        <main className="flex-1 p-6 min-h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
