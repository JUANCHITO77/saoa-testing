import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Ingreso.css';

const Ingreso = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const users = JSON.parse(localStorage.getItem('saoa_users') || '[]');
    const found = users.find(
      u => u.email === formData.email && u.password === formData.password
    );
    if (!found) {
      setError('Correo o contraseña incorrectos');
      return;
    }
    const { password, ...userData } = found;
    login(userData);
    navigate('/asignacion-citas');
  };

  return (
    <div className="public-page-wrapper">
      <div className="ingreso-form-container">
        <h1 className="ingreso-title">Ingreso SAOA</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <div className="input-group">
              <span className="input-group-icon">👤</span>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Ingrese su correo"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-group">
              <span className="input-group-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Ingrese su contraseña"
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn-ingreso">Ingresar</button>
          <div className="form-links">
            <Link to="/registro">¿No tienes cuenta? Regístrate</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Ingreso;
