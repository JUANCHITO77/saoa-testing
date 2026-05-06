import React, { useState, useEffect } from 'react';
import Keypad from '../Components/Keypad';
import QwertyKeyboard from '../Components/QwertyKeyboard';
import axios from 'axios';
import './Styles/CheckInPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const CheckInPage = () => {
  // Estados del flujo
  const [step, setStep] = useState('documento');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Datos recolectados
  const [documento, setDocumento] = useState('');
  const [cita, setCita] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [nombrePreferido, setNombrePreferido] = useState('');
  const [turnoGenerado, setTurnoGenerado] = useState(null);

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const resetFlow = () => {
    setStep('documento');
    setDocumento('');
    setNombrePreferido('');
    setCita(null);
    setError('');
    setServicioSeleccionado(null);
    setTurnoGenerado(null);
  };

  useEffect(() => {
    if (step === 'final') {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            resetFlow();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'seleccionServicio') {
      const fetchServicios = async () => {
        try {
          const response = await axios.get(`${API_URL}/tipos-atencion/publicos`);
          setServicios(response.data);
        } catch (err) {
          setError('No se pudieron cargar los servicios. Intente de nuevo.');
        }
      };
      fetchServicios();
    }
  }, [step]);

  const handleNumericKeyPress = (key) => setDocumento(prev => prev + key);
  const handleNumericClear = () => setDocumento(prev => prev.slice(0, -1));
  const handleQwertyKeyPress = (key) => setNombrePreferido(prev => prev + key);
  const handleQwertyBackspace = () => setNombrePreferido(prev => prev.slice(0, -1));

  const handleDocumentoSubmit = async () => {
    if (!documento) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/citas/validar-hoy`, { numeroDocumento: documento });
      setCita(response.data);
      setStep('confirmacion');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setStep('seleccionServicio');
      } else {
        setError('Error al validar el documento. Intente de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleServicioSelect = (servicio) => {
    setServicioSeleccionado(servicio);
    setNombrePreferido('');
    setStep('nombrePreferido');
  };

  const handleConfirmarIdentidad = () => {
    setServicioSeleccionado({ id: 1, nombre: 'Identificación 1' });
    setNombrePreferido(cita.Nombre_Cliente.toUpperCase());
    setStep('nombrePreferido');
  };

  const handleTurnoSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/turnos`, {
        numeroDocumento: documento,
        nombrePreferido: nombrePreferido.toUpperCase(),
        servicioId: servicioSeleccionado.id
      });
      setTurnoGenerado(response.data.turno);
      setStep('final');
    } catch (err) {
      setError('No se pudo generar el turno. Intente de nuevo.');
      setStep('nombrePreferido');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    if (isLoading) return <p>Cargando...</p>;

    switch (step) {
      case 'documento':
        return (
          <>
            <p style={{ fontSize: '1.5rem', color: 'black', fontWeight: '500' }}>
              Por favor, ingrese su número de cédula:
            </p>
            <div className="document-display">{documento || '...'}</div>
            {error && <p className="error-message">{error}</p>}
            <Keypad onKeyPress={handleNumericKeyPress} onClear={handleNumericClear} onConfirm={handleDocumentoSubmit} />
          </>
        );
      case 'confirmacion':
        return (
          <div className="confirmation-container">
            <h2>¿Es usted {cita?.Nombre_Cliente?.toUpperCase()}?</h2>
            <button className="confirm-button" onClick={handleConfirmarIdentidad}>Confirmar Cita</button>
            <button className="cancel-button" onClick={resetFlow}>No soy yo</button>
          </div>
        );
      case 'seleccionServicio':
        return (
          <div className="service-selection-container">
            <h2>No tiene una cita agendada.</h2>
            <p>Por favor, seleccione un servicio:</p>
            <div className="service-buttons">
              {/* Botones que vienen de la BD */}
              {servicios.map(s => (
                <button key={s.id} className="service-button" onClick={() => handleServicioSelect(s)}>
                  {s.nombre}
                </button>
              ))}
              {/* --- NUEVO: Botón quemado para "Otros servicios" --- */}
              <button 
                className="service-button" 
                onClick={() => handleServicioSelect({ id: 4, nombre: 'Información', letra: 'IN' })}
              >
                Otros servicios
              </button>
            </div>
            <button className="cancel-button" onClick={resetFlow}>Cancelar</button>
          </div>
        );
      case 'nombrePreferido':
        return (
          <div className="name-input-container">
            {cita && <h2>Su nombre registrado es: {cita.Nombre_Cliente.toUpperCase()}</h2>}
            <p>¿Cómo prefiere que lo llamen en pantalla?</p>
            <div className="document-display name-display">{nombrePreferido || '...'}</div>
            <QwertyKeyboard onKeyPress={handleQwertyKeyPress} onBackspace={handleQwertyBackspace} onConfirm={handleTurnoSubmit} />
          </div>
        );
      case 'final':
        return (
          <div className="final-message">
            <h2>¡Gracias, {turnoGenerado?.nombre_preferido}!</h2>
            <p>Su turno es:</p>
            <div className="ticket-display">{turnoGenerado?.ticket_completo}</div>
            <button className="confirm-button" onClick={resetFlow}>
              Finalizar ({countdown})
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="checkin-container">
      <div className="checkin-box">
        <h1 style={{ fontSize: '2.5rem', color: '#0056b3', marginBottom: '20px' }}>Confirmar turnos OPADI</h1>
        {renderStep()}
      </div>
    </div>
  );
};

export default CheckInPage;
