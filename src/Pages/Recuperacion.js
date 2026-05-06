import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import '../CSS/Recuperacion.css';

function RecuperacionC() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Asumiendo que el backend tiene una ruta para solicitar el reseteo de contraseña
      // y que espera un objeto con la propiedad 'email'.
      await api.post('/auth/request-password-reset', { email });
      navigate('/cambio-contrasena', {
        state: {
          message: 'Se ha enviado un código de recuperación a tu correo electrónico. Por favor, revísalo para continuar.',
          email: email // Opcional: pasar el email para pre-llenar en la siguiente pantalla
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al solicitar la recuperación de contraseña. Por favor, verifica tu correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='public-page-wrapper'>
      <div>
        <h1>Recuperar Contraseña</h1>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">Correo Electrónico:</label>
                <input type="email" id="email" name="email" placeholder="Ingrese su correo" value={email} onChange={handleChange} required disabled={loading} />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <button type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Enlace'}
                </button>
            </div>
        </form>
      </div>
    </div> 
  );
}

export default RecuperacionC;