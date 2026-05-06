import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Styles/CambioP.css'; // Asegúrate de crear y dar estilo a este archivo CSS

const CambioPC = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Pre-rellena el email si viene desde la página de recuperación
  useEffect(() => {
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setFormData(prev => ({ ...prev, email: emailFromState }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación de contraseñas
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password-with-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocurrió un error al cambiar la contraseña.');
      }

      setSuccess('¡Contraseña actualizada con éxito! Serás redirigido al inicio de sesión.');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/ingreso');
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cambio-password-container">
      <div className="cambio-password-form">
        <h2>Cambiar Contraseña</h2>
        <p>Ingresa tu correo, el código que recibiste y tu nueva contraseña.</p>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Correo Electrónico" value={formData.email} onChange={handleChange} required />
          <input type="text" name="code" placeholder="Código de Recuperación" value={formData.code} onChange={handleChange} required />
          <input type="password" name="newPassword" placeholder="Nueva Contraseña" value={formData.newPassword} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirmar Nueva Contraseña" value={formData.confirmPassword} onChange={handleChange} required />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );
};

export default CambioPC;