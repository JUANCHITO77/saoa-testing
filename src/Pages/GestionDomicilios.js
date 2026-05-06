import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { useAuth } from '../Context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Asignacion_Citas.css'; 

const formatDateForPdf = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch (e) {
    return 'Fecha inválida';
  }
};

const GestionDomicilios = () => {
  const { user } = useAuth();
  const [domicilios, setDomicilios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingDomicilio, setEditingDomicilio] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const initialFilters = { radicado: '', startDate: '', endDate: '', tramite: '', estado: '' };
  const [filters, setFilters] = useState(initialFilters);

  const gruposPoblacionales = ["HABITANTE DE CALLE", "ADULTO MAYOR", "DISCAPACIDAD", "NIÑEZ", "VICTIMAS - DESPLAZADOS", "ETNIAS", "CAMPAÑAS", "OTROS", "POBLACIÓN CARCELARIA", "POBLACIÓN LGTBIQ+", "NN CENTRO DE SALUD", "CENTRO DE SALUD", "INSTITUCIONALIZADAS - ALBERGUE", "REPROCESOS"];
  const tramites = ["PRIMERA VEZ CC", "DUPLICADO CC", "RENOVACIÓN CC", "RECTIFICACIÓN CC", "PRIMERA VEZ TI", "DUPLICADO TI", "RENOVACIÓN TI", "RECTIFICACIÓN TI", "PLENA IDENTIDAD", "ENTREGA DOCUMENTO CC", "ENTREGA DOCUMENTO TI"];
  const registradurias = ["REGISTRADURIA OPADI ANTIOQUIA", "REGISTRADURIA ESPECIAL DE MEDELLIN", "REGISTRADURIA ESPECIAL BELLO", "REGISTRADURIA ESPECIAL ENVIGADO", "REGISTRADURIA ESPECIAL ITAGUI", "REGISTRADURIA MUNICIPAL DE BARBOSA", "REGISTRADURIA MUNICIPAL DE GIRARDOTA", "REGISTRADURIA MUNICIPAL DE CALDAS", "REGISTRADURIA MUNICIPAL DE COPACABANA", "REGISTRADURIA MUNICIPAL DE LA ESTRELLA", "REGISTRADURIA MUNICIPAL DE SABANETA", "REGISTRADURIA AUXILIAR DEL BOSQUE", "REGISTRADURIA AUXILIAR DE CASTILLA", "REGISTRADURIA AUXILIAR DEL POBLADO", "REGISTRADURIA AUXILIAR DE LA FLORESTA", "REGISTRADURIA AUXILIAR SAN CRISTOBAL", "REGISTRADURIA AUXILIAR DE BELEN", "REGISTRADURIA AUXILIAR DE SAN ANTONIO DE PRADO"];
  const funcionarios = ["JUAN GUILLERMO HOYOS BOTERO", "LUIS FELIPE SANCHEZ", "JUAN PABLO CEBALLOS", "LUZ STELLA ZAPATA VASQUEZ", "JUAN DANIEL BEDOYA"];
  const estados = ["ANULADO", "EN PROCESO", "FALLIDO", "REALIZADO"];

  const initialFormState = {
    Fecha_Recepcion: '', Grupo_Poblacional: '', Tramite_Realizar: '',
    Registraduria_Documento: '', NUIP: '', Nombres_Apellidos: '', Direccion: '',
    Telefono: '', Responsable_Entidad: '', Funcionario_Responsable: '',
    Fecha_Estimada_Realizacion: '', Observaciones: '', Estado_Domicilio: 'EN PROCESO',
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchDomicilios = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: 10 });
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await api.get(`/api/domicilios?${params.toString()}`);
      setDomicilios(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError('Error al cargar los domicilios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomicilios(1, initialFilters);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchDomicilios(1, filters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    fetchDomicilios(1, initialFilters);
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const response = await api.get('/api/domicilios/report');
      const allDomicilios = response.data;

      if (!allDomicilios || allDomicilios.length === 0) {
        setNotification({ type: 'error', message: 'No hay domicilios para generar un reporte.' });
        setIsGeneratingPdf(false);
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape' });
      doc.text("Reporte General de Domicilios", 14, 16);
      
      const tableColumn = ["Radicado", "F. Recepción", "Grupo Poblacional", "Trámite", "NUIP", "Nombre", "Dirección", "Teléfono", "Responsable", "Funcionario", "Estado", "F. Estimada"];
      const tableRows = [];

      allDomicilios.forEach(d => {
        const domicilioData = [
          String(d.Radicado_Domicilio || ''), formatDateForPdf(d.Fecha_Recepcion), String(d.Grupo_Poblacional || ''),
          String(d.Tramite_Realizar || ''), String(d.NUIP || ''), String(d.Nombres_Apellidos || ''),
          String(d.Direccion || ''), String(d.Telefono || ''), String(d.Responsable_Entidad || ''),
          String(d.Funcionario_Responsable || ''), String(d.Estado_Domicilio || ''), formatDateForPdf(d.Fecha_Estimada_Realizacion),
        ];
        tableRows.push(domicilioData);
      });

      // --- ¡CAMBIO CLAVE! Sintaxis correcta para jspdf-autotable v3.x ---
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [0, 48, 87] },
      });

      doc.save('reporte_domicilios.pdf');

    } catch (error) {
      console.error("Error al generar PDF:", error);
      setNotification({ type: 'error', message: 'Error al generar el reporte PDF.' });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, Id_Usuario: user.id };
      if (editingDomicilio) {
        await api.put(`/api/domicilios/${editingDomicilio.Id_Domicilio}`, payload);
        setNotification({ type: 'success', message: 'Domicilio actualizado exitosamente' });
      } else {
        await api.post('/api/domicilios', payload);
        setNotification({ type: 'success', message: 'Domicilio creado exitosamente' });
      }
      setShowModal(false);
      fetchDomicilios(pagination.page, filters);
      resetForm();
    } catch (err) {
      setNotification({ type: 'error', message: 'Error al procesar el domicilio.' });
    }
  };

  const handleEdit = async (domicilio) => {
    try {
      const response = await api.get(`/api/domicilios/${domicilio.Id_Domicilio}`);
      const domicilioCompleto = response.data;
      setEditingDomicilio(domicilioCompleto);
      setFormData({
        Fecha_Recepcion: domicilioCompleto.Fecha_Recepcion?.split('T')[0] || '',
        Grupo_Poblacional: domicilioCompleto.Grupo_Poblacional || '',
        Tramite_Realizar: domicilioCompleto.Tramite_Realizar || '',
        Registraduria_Documento: domicilioCompleto.Registraduria_Documento || '',
        NUIP: domicilioCompleto.NUIP || '',
        Nombres_Apellidos: domicilioCompleto.Nombres_Apellidos || '',
        Direccion: domicilioCompleto.Direccion || '',
        Telefono: domicilioCompleto.Telefono || '',
        Responsable_Entidad: domicilioCompleto.Responsable_Entidad || '',
        Funcionario_Responsable: domicilioCompleto.Funcionario_Responsable || '',
        Fecha_Estimada_Realizacion: domicilioCompleto.Fecha_Estimada_Realizacion?.split('T')[0] || '',
        Estado_Domicilio: domicilioCompleto.Estado_Domicilio || 'EN PROCESO',
        Observaciones: '',
      });
      setShowModal(true);
    } catch (error) {
      setNotification({ type: 'error', message: 'Error al cargar el detalle del domicilio.' });
    }
  };
  
  const resetForm = () => {
    setFormData(initialFormState);
    setEditingDomicilio(null);
  };

  const handlePreviousPage = () => {
    if (pagination.page > 1) fetchDomicilios(pagination.page - 1, filters);
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) fetchDomicilios(pagination.page + 1, filters);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="asignacion-citas-container">
      <div className="page-header">
        <h1>Gestión de Domicilios</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          Registrar Domicilio
        </button>
      </div>

      <div className="filters-container">
        <input type="text" name="radicado" placeholder="Buscar por Radicado..." value={filters.radicado} onChange={handleFilterChange} />
        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        <select name="tramite" value={filters.tramite} onChange={handleFilterChange}>
          <option value="">Todos los Trámites</option>
          {tramites.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select name="estado" value={filters.estado} onChange={handleFilterChange}>
          <option value="">Todos los Estados</option>
          {estados.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <button className="btn-primary" onClick={handleSearch}>Buscar</button>
        <button className="btn-secondary" onClick={handleClearFilters}>Limpiar</button>
      </div>

      {user.tipo_usuario === 'registrador' && domicilios.length > 0 && (
        <div className="pdf-button-container">
          <button className="btn-pdf" onClick={handleGeneratePdf} disabled={isGeneratingPdf}>
            {isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>
      )}

      <div className="table-container">
        <table className="citas-table">
          <thead>
            <tr>
              <th>Radicado</th>
              <th>Fecha Recepción</th>
              <th>Nombres y Apellidos</th>
              <th>Trámite</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {domicilios.map((d) => (
              <tr key={d.Id_Domicilio}>
                <td>{d.Radicado_Domicilio}</td>
                <td>{new Date(d.Fecha_Recepcion).toLocaleDateString()}</td>
                <td>{d.Nombres_Apellidos}</td>
                <td>{d.Tramite_Realizar}</td>
                <td>{d.Estado_Domicilio}</td>
                <td className="acciones-cell">
                  <button className="btn-editar" onClick={() => handleEdit(d)}>Ver / Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="pagination-container">
          <button onClick={handlePreviousPage} disabled={pagination.page <= 1}>Anterior</button>
          <span>Página {pagination.page} de {pagination.totalPages}</span>
          <button onClick={handleNextPage} disabled={pagination.page >= pagination.totalPages}>Siguiente</button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h2>{editingDomicilio ? 'Detalle del Domicilio' : 'Nuevo Domicilio'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                {editingDomicilio && (
                  <div className="form-group full-width">
                    <label>Número de Radicado</label>
                    <div className="radicado-display-field">{editingDomicilio.Radicado_Domicilio}</div>
                  </div>
                )}
                <div className="form-group"><label>Fecha Recepción</label><input type="date" name="Fecha_Recepcion" value={formData.Fecha_Recepcion} onChange={handleChange} required /></div>
                <div className="form-group"><label>Grupo Poblacional</label><select name="Grupo_Poblacional" value={formData.Grupo_Poblacional} onChange={handleChange} required><option value="">Seleccione...</option>{gruposPoblacionales.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                <div className="form-group"><label>Trámite a Realizar</label><select name="Tramite_Realizar" value={formData.Tramite_Realizar} onChange={handleChange} required><option value="">Seleccione...</option>{tramites.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div className="form-group"><label>Registraduría Documento</label><select name="Registraduria_Documento" value={formData.Registraduria_Documento} onChange={handleChange}><option value="">Seleccione...</option>{registradurias.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                <div className="form-group"><label>NUIP</label><input type="text" name="NUIP" value={formData.NUIP} onChange={handleChange} required /></div>
                <div className="form-group"><label>Nombres y Apellidos</label><input type="text" name="Nombres_Apellidos" value={formData.Nombres_Apellidos} onChange={handleChange} required /></div>
                <div className="form-group"><label>Dirección Domicilio y Barrio</label><input type="text" name="Direccion" value={formData.Direccion} onChange={handleChange} required /></div>
                <div className="form-group"><label>Teléfono de Contacto</label><input type="text" name="Telefono" value={formData.Telefono} onChange={handleChange} /></div>
                <div className="form-group"><label>Persona o Entidad Responsable</label><input type="text" name="Responsable_Entidad" value={formData.Responsable_Entidad} onChange={handleChange} /></div>
                <div className="form-group"><label>Funcionario Responsable</label><select name="Funcionario_Responsable" value={formData.Funcionario_Responsable} onChange={handleChange} required><option value="">Seleccione...</option>{funcionarios.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                <div className="form-group"><label>Fecha Estimada de Realización</label><input type="date" name="Fecha_Estimada_Realizacion" value={formData.Fecha_Estimada_Realizacion} onChange={handleChange} /></div>
                <div className="form-group">
                  <label>Estado del Domicilio</label>
                  {editingDomicilio ? (
                    <select name="Estado_Domicilio" value={formData.Estado_Domicilio} onChange={handleChange}>
                      {estados.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  ) : (
                    <input type="text" value="EN PROCESO" readOnly />
                  )}
                </div>
              </div>
              <div className="form-group full-width">
                <label>{editingDomicilio ? 'Añadir Nueva Observación' : 'Observaciones Iniciales'}</label>
                <textarea name="Observaciones" value={formData.Observaciones} onChange={handleChange} rows="3"></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingDomicilio ? 'Guardar Cambios' : 'Crear'}</button>
              </div>
            </form>
            {editingDomicilio && (
              <div className="history-section">
                <h3>Historial y Seguimiento</h3>
                <div className="timeline">
                  {editingDomicilio.DomicilioHistorials.map(hist => (
                    <div key={hist.Id_Historial} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <strong>{hist.Accion}</strong> por {hist.Usuario.Nombre} {hist.Usuario.Apellido}
                          <span className="timeline-date">{new Date(hist.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="timeline-details">{hist.Detalles}</p>
                        {hist.Observaciones && <p className="timeline-obs"><strong>Observación:</strong> {hist.Observaciones}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}
    </div>
  );
};

export default GestionDomicilios;
