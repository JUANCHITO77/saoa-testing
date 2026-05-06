import React from 'react';
import './Header.css';

const Header = ({ onMenuToggle }) => {
  return (
    <header className="app-header">
      <button onClick={onMenuToggle} className="menu-toggle-btn">
        ☰
      </button>
      <div className="header-title">SAOA Turnos</div>
    </header>
  );
};

export default Header;
