import { useState, useCallback } from 'react';
import api from '../config/api';

export const useApi = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await api.get(endpoint, { params });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Error en la petición');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const createData = useCallback(async (body) => {
    try {
      setLoading(true);
      const response = await api.post(endpoint, body);
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Error en la petición');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const updateData = useCallback(async (id, body) => {
    try {
      setLoading(true);
      const response = await api.put(`${endpoint}/${id}`, body);
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.response?.data || 'Error en la petición');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const deleteData = useCallback(async (id) => {
    try {
      setLoading(true);
      await api.delete(`${endpoint}/${id}`);
      setData(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Error en la petición');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    fetchData,
    createData,
    updateData,
    deleteData
  };
}; 