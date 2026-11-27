// Importo useState para gestionar la máquina de estados de la petición (datos, carga y error)
// e importo useEffect para sincronizar la llamada a la API con el montaje del componente o cambios en la URL
import { useState, useEffect } from 'react';
// Importo mi instancia configurada de Axios ('api') que ya tiene la baseURL e interceptores de token JWT
import api from '../services/api';

// Creo este Custom Hook para abstraer y reutilizar la lógica repetitiva de peticiones GET en toda la aplicación (principio DRY).
// Encapsula los tres estados estándar de cualquier consulta asíncrona: data, loading y error.
function useFetch(url) {
  // Inicializo 'data' en null porque todavía no recibí respuesta del servidor
  const [data, setData] = useState(null);
  // Inicializo 'loading' en true para que el componente consumidor muestre un spinner/skeleton desde el primer render
  const [loading, setLoading] = useState(true);
  // Inicializo 'error' en null para limpiar fallos previos
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cláusula de guarda (Early Return): si la URL viene vacía, null o undefined (por ejemplo,
    // mientras espero un ID dinámico), corto la ejecución para evitar hacer una petición inválida.
    if (!url) return;

    // Defino una función interna asíncrona porque el callback de useEffect no puede ser 'async' directamente
    // (ya que devolvería una Promesa en lugar de una función de limpieza / cleanup).
    const fetchData = async () => {
      // Reinicio los estados cada vez que cambia la 'url' para evitar mostrar datos viejos o errores anteriores mientras carga lo nuevo
      setLoading(true);
      setError(null);

      try {
        // Ejecuto la petición GET usando mi cliente Axios centralizado
        const response = await api.get(url);
        setData(response.data);
      } catch (err) {
        // Normalizo el mensaje de error buscando primero el mensaje personalizado de mi backend ('mensaje'),
        // luego el error técnico de Axios/red ('err.message'), y finalmente un texto genérico de respaldo.
        setError(err.response?.data?.mensaje || err.message || 'Error al cargar los datos');
      } finally {
        // Me aseguro de apagar el indicador de carga sin importar si la promesa se resolvió o rechazó
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // El array de dependencias garantiza que la petición se vuelva a disparar automáticamente solo si cambia la 'url'

  // Retorno un objeto con los estados para que el componente que lo consuma pueda desestructurar solo lo que necesite
  return { data, loading, error };
}

export default useFetch;