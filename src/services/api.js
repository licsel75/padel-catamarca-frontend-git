// Importo Axios para gestionar las peticiones HTTP hacia mi backend con una interfaz más limpia y extensible que fetch nativo
import axios from 'axios';

// Creo una instancia personalizada de Axios en lugar de usar el objeto global.
// Esto me permite fijar una única baseURL desde las variables de entorno de Vite (VITE_API_URL),
// desacoplando la dirección del servidor para poder cambiar fácilmente entre localhost y producción sin tocar los componentes.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Configuro un Interceptor de Peticiones (Request Interceptor): actúa como un middleware en el frontend
// que atrapa cada request saliente antes de que salga hacia el servidor.
api.interceptors.request.use((config) => {
  // Leo el token directamente desde localStorage en el momento exacto en que se dispara la petición
  // (así siempre obtengo el valor más reciente, incluso justo después de un login o logout).
  const token = localStorage.getItem('padel_token');
  
  if (token) {
    // Si existe una sesión activa, inyecto automáticamente la cabecera Authorization siguiendo el estándar Bearer.
    // De esta forma evito repetir manualmente los headers en cada llamada (api.get, api.post, api.put) de toda la app.
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Retorno el objeto 'config' modificado (o intacto si es una ruta pública sin token) para que Axios continúe con el envío
  return config;
});

export default api;