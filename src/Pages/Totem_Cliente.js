import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import '../CSS/Totem.css';

const Totem_Cliente = () => {
  const { data, loading, error, fetchData, createData } = useApi('/clientes');
  const [formData, setFormData] = useState({
    Nombre_Cliente: '',
    Apellido_Cliente: '',
    Email_Cliente: '',
    Telefono_cliente: '',
    Estado_Cliente: ''
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createData(formData);
      setFormData({
        Nombre_Cliente: '',
        Apellido_Cliente: '',
        Email_Cliente: '',
        Telefono_cliente: '',
        Estado_Cliente: ''
      });
      fetchData();
    } catch (err) {
      console.error('Error al crear cliente:', err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='public-page-wrapper'>
      <h1>Registro de Cliente</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="Nombre_Cliente" value={formData.Nombre_Cliente} onChange={handleChange} required />
        </div>
        <div>
          <label>Apellido:</label>
          <input type="text" name="Apellido_Cliente" value={formData.Apellido_Cliente} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="Email_Cliente" value={formData.Email_Cliente} onChange={handleChange} required />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="number" name="Telefono_cliente" value={formData.Telefono_cliente} onChange={handleChange} required />
        </div>
        <div>
          <label>Estado:</label>
          <input type="text" name="Estado_Cliente" value={formData.Estado_Cliente} onChange={handleChange} required />
        </div>
        <button type="submit">Registrar Cliente</button>
      </form>

      <h2>Lista de Clientes</h2>
      {data?.data.map(cliente => (
        <div key={cliente.Id_Cliente}>
          <h3>{cliente.Nombre_Cliente} {cliente.Apellido_Cliente}</h3>
          <p>Email: {cliente.Email_Cliente}</p>
          <p>Teléfono: {cliente.Telefono_cliente}</p>
          <p>Estado: {cliente.Estado_Cliente}</p>
        </div>
      ))}
    </div>
  );
};

export default Totem_Cliente;