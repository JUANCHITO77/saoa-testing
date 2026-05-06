import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/ingreso');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>SAOA</h3>
      </div>
      <div className="user-profile">
        <div className="user-avatar">
          <FaUserCircle />
        </div>
        <span className="user-name">{user.nombre} {user.apellido}</span>
        <span className="user-role">{user.email}</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink
          to="/asignacion-citas"
          className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
          onClick={onClose}
        >
          Asignación de Citas
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
