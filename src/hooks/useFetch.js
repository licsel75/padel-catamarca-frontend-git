import { useState, useEffect } from 'react';
import api from '../services/api';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si no hay URL, no hacemos la petición
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(url);
        setData(response.data);
      } catch (err) {
        // Si el backend devuelve un error, lo atrapamos
        setError(err.response?.data?.mensaje || err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;