import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Ingreso.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const users = JSON.parse(localStorage.getItem('saoa_users') || '[]');
    if (users.find(u => u.email === formData.email)) {
      setError('Ya existe un usuario registrado con ese correo');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    users.push(newUser);
    localStorage.setItem('saoa_users', JSON.stringify(users));
    setSuccess('Usuario registrado exitosamente. Redirigiendo al ingreso...');
    setTimeout(() => navigate('/ingreso'), 1500);
  };

  return (
    <div className="public-page-wrapper">
      <div className="ingreso-form-container">
        <h1 className="ingreso-title">Registro SAOA</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <div className="input-group">
              <span className="input-group-icon">✏️</span>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Nombre"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <div className="input-group">
              <span className="input-group-icon">✏️</span>
              <input
                type="text"
                id="apellido"
                name="apellido"
                className="form-control"
                value={formData.apellido}
                onChange={handleChange}
                required
                placeholder="Apellido"
              />
            </div>
          </div>
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
                placeholder="Correo electrónico"
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
                placeholder="Contraseña (mínimo 6 caracteres)"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <div className="input-group">
              <span className="input-group-icon">🔒</span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Repetir contraseña"
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div style={{ color: '#28a745', textAlign: 'center', marginTop: '1rem', fontWeight: 500 }}>
              {success}
            </div>
          )}
          <button type="submit" className="btn-ingreso">Registrarse</button>
          <div className="form-links">
            <Link to="/ingreso">¿Ya tienes cuenta? Ingresar</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
