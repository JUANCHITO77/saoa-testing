import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { FaInfoCircle } from 'react-icons/fa';
import './Styles/Llamado_Turnos.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const modulos = [
  "Identificación 1", "Identificación 2", "Atención domiciliaria",
  "Información", "Entrega de documentos"
];

const LlamadoTurnos = () => {
  const { token } = useAuth();
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null);
  const [turnoActual, setTurnoActual] = useState(null);
  const [cola, setCola] = useState([]);
  const [rezagados, setRezagados] = useState([]);
  const [error, setError] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);

  // --- NUEVO: Estados para el modal de referir ---
  const [showReferirModal, setShowReferirModal] = useState(false);
  const [moduloDestino, setModuloDestino] = useState('');

  const fetchData = async (modulo) => {
    // ... (código sin cambios)
  };

  useEffect(() => {
    // ... (código sin cambios)
  }, [moduloSeleccionado, token, turnoActual]);

  useEffect(() => {
    // ... (código sin cambios)
  }, [popoverRef]);

  const handleLlamarSiguiente = async () => {
    // ... (código sin cambios)
  };

  const handleLlamarRezagado = async (turno) => {
    // ... (código sin cambios)
  };

  const handleRellamar = async () => {
    // ... (código sin cambios)
  };

  const handleAtender = async () => {
    // ... (código sin cambios)
  };

  const handleNoAtender = async () => {
    // ... (código sin cambios)
  };

  // --- ¡NUEVA FUNCIÓN PARA REFERIR! ---
  const handleReferir = async () => {
    if (!turnoActual || !moduloDestino) {
      setError('Debe seleccionar un módulo de destino.');
      return;
    }
    setIsCalling(true);
    try {
      await axios.post(`${API_URL}/turnos/referir/${turnoActual.id}`, { nuevoModulo: moduloDestino }, { headers: { Authorization: `Bearer ${token}` } });
      setTurnoActual(null); // Limpiar turno actual
      setShowReferirModal(false); // Cerrar modal
      setModuloDestino(''); // Resetear selección
      fetchData(moduloSeleccionado); // Refrescar la cola actual
    } catch (err) {
      handleApiError(err, 'Error al referir el turno.');
    } finally {
      setIsCalling(false);
    }
  };

  const handleApiError = (err, defaultMessage) => {
    // ... (código sin cambios)
  };

  if (!moduloSeleccionado) {
    // ... (código sin cambios)
  }

  return (
    <div className="llamado-container">
      {/* ... (header sin cambios) ... */}

      <div className="main-content-llamado">
        <div className="turno-actual-card">
          <h3>Turno Actual</h3>
          {turnoActual ? (
            <>
              {/* ... (display del turno y cita previa sin cambios) ... */}
              <div className="turno-actions">
                <button className="action-btn rellamar" onClick={handleRellamar} disabled={isCalling}>Rellamar</button>
                <button className="action-btn atendido" onClick={handleAtender} disabled={isCalling}>Atendido</button>
                <button className="action-btn no-atendido" onClick={handleNoAtender} disabled={isCalling}>No Atendido</button>
                {/* --- ¡NUEVO BOTÓN! --- */}
                <button className="action-btn referir" onClick={() => setShowReferirModal(true)} disabled={isCalling}>Referir</button>
              </div>
            </>
          ) : (
            <div className="no-turno">Presione "Llamar Siguiente"</div>
          )}
        </div>
        {/* ... (resto de las tarjetas de cola y rezagados) ... */}
      </div>

      {/* ... (botón llamar siguiente) ... */}

      {/* --- ¡NUEVO MODAL DE REFERIR! --- */}
      {showReferirModal && (
        <div className="modal-overlay">
          <div className="modal-content-small">
            <div className="modal-header">
              <h2>Referir Turno</h2>
              <button className="modal-close" onClick={() => setShowReferirModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Seleccione el módulo al que desea referir el turno <strong>{turnoActual?.ticket_completo}</strong>:</p>
              <select
                className="form-control"
                value={moduloDestino}
                onChange={(e) => setModuloDestino(e.target.value)}
              >
                <option value="">Seleccione un módulo...</option>
                {modulos
                  .filter(m => m !== moduloSeleccionado) // Excluir el módulo actual
                  .map(m => <option key={m} value={m}>{m}</option>)
                }
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowReferirModal(false)}>Cancelar</button>
              <button type="button" className="btn-primary" onClick={handleReferir} disabled={!moduloDestino || isCalling}>
                {isCalling ? 'Refiriendo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LlamadoTurnos;
