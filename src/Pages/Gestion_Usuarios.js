import React, { useState, useEffect } from 'react';
import api from '../config/api';
import './Gestion_Usuarios.css'; // Restaurando el uso de su propio archivo CSS

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const initialFormState = {
    Nombre: '', Apellido: '', Celular: '', Email: '',
    Contraseña: '', Tipo_Usuario: '', Entidad: '',
    Estado_Usuario: true, Debe_Cambiar_Contrasena: false
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/usuarios');
      // Corrección para asegurar que la respuesta siempre sea un array
      if (Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else {
        console.error("La respuesta de la API no es un array:", response.data);
        setUsuarios([]); // Prevenir el crash
      }
      setError(null);
    } catch (err) {
      setError('Error al cargar los usuarios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editingUser && !payload.Contraseña) {
        delete payload.Contraseña;
      }

      if (editingUser) {
        await api.put(`/api/usuarios/${editingUser.Id_Usuario}`, payload);
        setNotification({ type: 'success', message: 'Usuario actualizado exitosamente' });
      } else {
        await api.post('/api/usuarios', payload);
        setNotification({ type: 'success', message: 'Usuario creado exitosamente' });
      }
      setShowModal(false);
      fetchUsuarios();
      resetForm();
    } catch (err) {
      setNotification({ type: 'error', message: 'Error al procesar el usuario.' });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      Nombre: user.Nombre || '',
      Apellido: user.Apellido || '',
      Celular: user.Celular || '',
      Email: user.Email || '',
      Contraseña: '',
      Tipo_Usuario: user.Tipo_Usuario || '',
      Entidad: user.Entidad || '',
      Estado_Usuario: user.Estado_Usuario,
      Debe_Cambiar_Contrasena: user.Debe_Cambiar_Contrasena || false
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingUser(null);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="gestion-usuarios-container">
      <div className="page-header">
        <h1>Gestión de Usuarios</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          Crear Usuario
        </button>
      </div>

      <div className="table-container">
        <table className="citas-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Entidad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.Id_Usuario}>
                <td>{`${user.Nombre} ${user.Apellido}`}</td>
                <td>{user.Email}</td>
                <td>{user.Tipo_Usuario}</td>
                <td>{user.Entidad || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${user.Estado_Usuario ? 'status-active' : 'status-inactive'}`}>
                    {user.Estado_Usuario ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="acciones-cell">
                  <button className="btn-editar" onClick={() => handleEdit(user)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group"><label>Nombre</label><input type="text" name="Nombre" value={formData.Nombre} onChange={handleChange} required /></div>
                <div className="form-group"><label>Apellido</label><input type="text" name="Apellido" value={formData.Apellido} onChange={handleChange} required /></div>
                <div className="form-group"><label>Celular</label><input type="text" name="Celular" value={formData.Celular} onChange={handleChange} /></div>
                <div className="form-group"><label>Email</label><input type="email" name="Email" value={formData.Email} onChange={handleChange} required /></div>
                <div className="form-group"><label>Contraseña</label><input type="password" name="Contraseña" value={formData.Contraseña} onChange={handleChange} placeholder={editingUser ? 'Dejar en blanco para no cambiar' : ''} required={!editingUser} /></div>
                <div className="form-group"><label>Rol</label><select name="Tipo_Usuario" value={formData.Tipo_Usuario} onChange={handleChange} required><option value="">Seleccione...</option><option value="registrador">Registrador</option><option value="operario_enlace">Operario Enlace</option><option value="coordinador_enlace">Coordinador Enlace</option><option value="operario_rnec">Operario RNEC</option></select></div>
                <div className="form-group"><label>Entidad</label><input type="text" name="Entidad" value={formData.Entidad} onChange={handleChange} /></div>
              </div>
              <div className="form-checkbox-group">
                <label>
                  <input type="checkbox" name="Estado_Usuario" checked={formData.Estado_Usuario} onChange={handleChange} />
                  Usuario Activo
                </label>
                <label>
                  <input type="checkbox" name="Debe_Cambiar_Contrasena" checked={formData.Debe_Cambiar_Contrasena} onChange={handleChange} />
                  Forzar Cambio de Contraseña
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">{editingUser ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notification && (
        <div className={`notification ${notification.type}`}>{notification.message}</div>
      )}
    </div>
  );
};

export default GestionUsuarios;
