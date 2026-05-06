import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { useAuth } from '../Context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Styles/Reportesp.css';

// --- Función para formatear la fecha (reutilizada) ---
const formatLocalDate = (dateString) => {
  if (!dateString) return 'N/A';
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

const Reportesp = () => {
  const { user } = useAuth();
  const [entidades, setEntidades] = useState([]);
  
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    entidad: user?.tipo_usuario === 'registrador' ? '' : user?.entidad || ''
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntidades = async () => {
      if (user?.tipo_usuario === 'registrador') {
        try {
          const response = await api.get('/api/usuarios/entidades');
          setEntidades(response.data);
        } catch (err) {
          console.error("Error al cargar entidades:", err);
        }
      }
    };
    fetchEntidades();
  }, [user]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (!filters.startDate || !filters.endDate) {
      setError('Por favor, seleccione un rango de fechas.');
      return;
    }
    
    setLoading(true);
    setError('');
    setReportData([]);

    try {
      const response = await api.get('/api/citas', {
        params: {
          ...filters,
          limit: 1000
        }
      });
      setReportData(response.data.data || []);
      if (response.data.data.length === 0) {
        setError('No se encontraron resultados para los filtros seleccionados.');
      }
    } catch (err) {
      setError('Error al generar el reporte. Intente de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (reportData.length === 0) {
      setError('No hay datos para exportar. Por favor, genere un reporte primero.');
      return;
    }

    const doc = new jsPDF();
    doc.text('Reporte de Citas Programadas', 14, 16);

    // --- CAMBIO: Añadir la nueva columna al PDF ---
    const tableColumn = [
      "Fecha Cita", "Entidad", "ID Cliente", "Nombre Cliente", "Servicio", "Estado", "Agendado por", "Respuesta Atención"
    ];
    const tableRows = [];

    reportData.forEach(item => {
      const rowData = [
        formatLocalDate(item.Fecha_cita), // --- CORRECCIÓN DE FECHA ---
        item.Entidad,
        item.Identificacion_Cliente,
        item.Nombre_Cliente || 'N/A',
        item.Servicio_Agendado,
        item.EstadoCita || 'Agendado', // Usar EstadoCita
        item.Usuario ? `${item.Usuario.Nombre} ${item.Usuario.Apellido}` : 'N/A',
        item.Respuesta_Atencion || 'N/A' // --- NUEVO CAMPO ---
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255] },
      styles: { fontSize: 8, cellPadding: 1.5 }, // Ajustar tamaño de fuente para más columnas
    });

    doc.save('reporte_citas.pdf');
  };

  return (
    <div className="reportes-container">
      <h1>Reporte de Citas</h1>
      
      <div className="filters-container">
        <input type="date" id="startDate" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
        <input type="date" id="endDate" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
        
        <select 
          id="entidad" 
          name="entidad" 
          value={filters.entidad} 
          onChange={handleFilterChange}
          disabled={user?.tipo_usuario !== 'registrador'}
        >
          {user?.tipo_usuario === 'registrador' ? (
            <>
              <option value="">Todas las entidades</option>
              {entidades.map(e => <option key={e} value={e}>{e}</option>)}
            </>
          ) : (
            <option value={user?.entidad}>{user?.entidad}</option>
          )}
        </select>

        <button onClick={handleSearch} disabled={loading} className="btn-search">
          {loading ? 'Buscando...' : 'Generar Reporte'}
        </button>
        <button onClick={downloadPDF} disabled={reportData.length === 0} className="btn-download">
          Descargar PDF
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="results-container">
        <h2>Resultados</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha Cita</th>
                <th>Entidad</th>
                <th>ID Cliente</th>
                <th>Nombre Cliente</th>
                <th>Servicio Agendado</th>
                <th>Estado</th>
                <th>Agendado por</th>
                <th>Respuesta Atención</th> {/* --- NUEVA COLUMNA --- */}
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? (
                reportData.map(item => (
                  <tr key={item.Id_cita}>
                    <td>{formatLocalDate(item.Fecha_cita)}</td> {/* --- CORRECCIÓN DE FECHA --- */}
                    <td>{item.Entidad}</td>
                    <td>{item.Identificacion_Cliente}</td>
                    <td>{item.Nombre_Cliente || 'N/A'}</td>
                    <td>{item.Servicio_Agendado}</td>
                    <td>{item.EstadoCita || 'Agendado'}</td>
                    <td>{item.Usuario ? `${item.Usuario.Nombre} ${item.Usuario.Apellido}` : 'N/A'}</td>
                    <td>{item.Respuesta_Atencion || 'N/A'}</td> {/* --- NUEVO CAMPO --- */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-results">No hay datos para mostrar.</td> {/* --- COLSPAN AJUSTADO --- */}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reportesp;
