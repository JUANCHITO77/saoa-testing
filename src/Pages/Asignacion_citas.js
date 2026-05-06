import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../Context/AuthContext';
import './Asignacion_Citas.css';

const STORAGE_KEY = 'saoa_citas';
const ITEMS_PER_PAGE = 10;

const servicios = [
  'PRIMERA VEZ C.C.', 'DUPLICADO C.C.', 'CÉDULA DIGITAL', 'RECTIFICACIÓN C.C.', 'RENOVACIÓN CC',
  'PRIMERA VEZ TI', 'DUPLICADO TI', 'RECTIFICACIÓN TI', 'RENOVACIÓN TI',
  'PLENA IDENTIDAD', 'VERSIÓN DE LOS HECHOS', 'TRÁMITES DOMICILIARIOS', 'ENTREGA DE DOCUMENTOS',
  'CERTIFICADOS DE NACIONALIDAD', 'CORRECCIÓN ANI', 'CORRECCIÓN DE RC', 'CAMBIO DE EMAIL',
];

const estados = ['Agendado', 'Atendido', 'No Atendido', 'Cancelado'];

const AsignacionCitas = () => {
  const { user } = useAuth();
  const [citas, setCitas] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCita, setEditingCita] = useState(null);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [notification, setNotification] = useState(null);

  const getInitialForm = useCallback(() => ({
    Servicio: '',
    Fecha_Cita: '',
    Id_Cliente: '',
    Nombre_Cliente: '',
    Observaciones: '',
    Entidad: '',
    Estado: 'Agendado',
    Respuesta_Atencion: '',
  }), []);

  const [formData, setFormData] = useState(getInitialForm);

  const loadCitas = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setCitas(stored);
  };

  useEffect(() => {
    loadCitas();
  }, []);

  const totalPages = Math.max(1, Math.ceil(citas.length / ITEMS_PER_PAGE));
  const paginatedCitas = citas.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const showNotif = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const resetForm = useCallback(() => {
    setFormData(getInitialForm());
    setEditingCita(null);
  }, [getInitialForm]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    if (editingCita) {
      const updated = stored.map(c =>
        c.Id_cita === editingCita.Id_cita
          ? {
              ...c,
              Servicio_Agendado: formData.Servicio,
              Fecha_cita: formData.Fecha_Cita,
              Identificacion_Cliente: formData.Id_Cliente,
              Nombre_Cliente: formData.Nombre_Cliente,
              Observaciones: formData.Observaciones,
              Entidad: formData.Entidad,
              EstadoCita: formData.Estado,
              Respuesta_Atencion: formData.Respuesta_Atencion,
              Usuario: user ? `${user.nombre} ${user.apellido}` : '',
            }
          : c
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      showNotif('success', 'Cita actualizada exitosamente');
    } else {
      const newCita = {
        Id_cita: Date.now().toString(),
        Servicio_Agendado: formData.Servicio,
        Fecha_cita: formData.Fecha_Cita,
        Identificacion_Cliente: formData.Id_Cliente,
        Nombre_Cliente: formData.Nombre_Cliente,
        Observaciones: formData.Observaciones,
        Entidad: formData.Entidad,
        EstadoCita: formData.Estado,
        Respuesta_Atencion: formData.Respuesta_Atencion,
        Usuario: user ? `${user.nombre} ${user.apellido}` : '',
        Id_Usuario: user?.id || '',
        createdAt: new Date().toISOString(),
      };
      stored.push(newCita);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      showNotif('success', 'Cita creada exitosamente');
    }

    setShowModal(false);
    resetForm();
    loadCitas();
  };

  const handleEdit = (cita) => {
    setEditingCita(cita);
    setFormData({
      Servicio: cita.Servicio_Agendado || '',
      Fecha_Cita: cita.Fecha_cita ? cita.Fecha_cita.split('T')[0] : '',
      Id_Cliente: cita.Identificacion_Cliente || '',
      Nombre_Cliente: cita.Nombre_Cliente || '',
      Observaciones: cita.Observaciones || '',
      Entidad: cita.Entidad || '',
      Estado: cita.EstadoCita || 'Agendado',
      Respuesta_Atencion: cita.Respuesta_Atencion || '',
    });
    setShowModal(true);
  };

  const handleDelete = (cita) => {
    setCitaToDelete(cita);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = stored.filter(c => c.Id_cita !== citaToDelete.Id_cita);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showNotif('success', 'Cita eliminada exitosamente');
    setShowDeleteModal(false);
    setCitaToDelete(null);
    loadCitas();
    const newTotal = Math.max(1, Math.ceil(updated.length / ITEMS_PER_PAGE));
    if (page > newTotal) setPage(newTotal);
  };

  const handleOpenModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const formatLocalDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="asignacion-citas-container">
      <div className="page-header">
        <h1>Asignación de Citas</h1>
        <button className="btn-primary" onClick={handleOpenModal}>
          Asignar Nueva Cita
        </button>
      </div>

      <div className="table-container">
        <table className="citas-table">
          <thead>
            <tr>
              <th>Entidad</th>
              <th>Servicio</th>
              <th>Fecha Cita</th>
              <th>Cliente</th>
              <th>Identificación</th>
              <th>Observaciones</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCitas.length > 0 ? (
              paginatedCitas.map((cita) => (
                <tr key={cita.Id_cita}>
                  <td>{cita.Entidad || 'N/A'}</td>
                  <td>{cita.Servicio_Agendado || 'N/A'}</td>
                  <td>{formatLocalDate(cita.Fecha_cita)}</td>
                  <td>{cita.Nombre_Cliente || 'N/A'}</td>
                  <td>{cita.Identificacion_Cliente || 'N/A'}</td>
                  <td>{cita.Observaciones || 'Ninguna'}</td>
                  <td>{cita.EstadoCita || 'Agendado'}</td>
                  <td className="acciones-cell">
                    <button className="btn-editar" onClick={() => handleEdit(cita)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => handleDelete(cita)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>
                  No hay citas registradas. ¡Crea la primera!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button onClick={() => setPage(p => p - 1)} disabled={page <= 1}>Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Siguiente</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCita ? 'Editar Cita' : 'Nueva Cita'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="Servicio">Servicio *</label>
                  <select
                    id="Servicio"
                    name="Servicio"
                    className="form-control"
                    value={formData.Servicio}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un servicio</option>
                    {servicios.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="Fecha_Cita">Fecha de Cita *</label>
                  <input
                    type="date"
                    id="Fecha_Cita"
                    name="Fecha_Cita"
                    className="form-control"
                    value={formData.Fecha_Cita}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Id_Cliente">Identificación del Cliente *</label>
                  <input
                    type="text"
                    id="Id_Cliente"
                    name="Id_Cliente"
                    className="form-control"
                    value={formData.Id_Cliente}
                    onChange={handleChange}
                    required
                    placeholder="Número de documento"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Nombre_Cliente">Nombre del Cliente *</label>
                  <input
                    type="text"
                    id="Nombre_Cliente"
                    name="Nombre_Cliente"
                    className="form-control"
                    value={formData.Nombre_Cliente}
                    onChange={handleChange}
                    required
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Entidad">Entidad</label>
                  <input
                    type="text"
                    id="Entidad"
                    name="Entidad"
                    className="form-control"
                    value={formData.Entidad}
                    onChange={handleChange}
                    placeholder="Entidad"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Estado">Estado</label>
                  <select
                    id="Estado"
                    name="Estado"
                    className="form-control"
                    value={formData.Estado}
                    onChange={handleChange}
                  >
                    {estados.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="Observaciones">Observaciones</label>
                  <textarea
                    id="Observaciones"
                    name="Observaciones"
                    className="form-control"
                    value={formData.Observaciones}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Observaciones adicionales"
                  />
                </div>
                {editingCita && (
                  <div className="form-group full-width">
                    <label htmlFor="Respuesta_Atencion">Respuesta Atención</label>
                    <textarea
                      id="Respuesta_Atencion"
                      name="Respuesta_Atencion"
                      className="form-control"
                      value={formData.Respuesta_Atencion}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Resultado de la atención"
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingCita ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && citaToDelete && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h2>Confirmar Eliminación</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p className="delete-warning">¿Está seguro que desea eliminar esta cita?</p>
              <div className="delete-cita-info">
                <p><strong>Cliente:</strong> {citaToDelete.Nombre_Cliente || citaToDelete.Identificacion_Cliente}</p>
                <p><strong>Servicio:</strong> {citaToDelete.Servicio_Agendado}</p>
                <p><strong>Fecha:</strong> {formatLocalDate(citaToDelete.Fecha_cita)}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-eliminar" onClick={handleDeleteConfirm}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}
    </div>
  );
};

export default AsignacionCitas;
