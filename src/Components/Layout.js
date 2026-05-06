import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header'; // --- NUEVO ---
import './Layout.css';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // --- NUEVO ---

  const handleMenuToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout-container">
      {/* --- CAMBIO: Se pasa el estado y la función al Sidebar --- */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        {/* --- NUEVO: Header para móviles --- */}
        <Header onMenuToggle={handleMenuToggle} />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
