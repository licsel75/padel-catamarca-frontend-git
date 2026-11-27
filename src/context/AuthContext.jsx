// Importo createContext y useContext para compartir la sesión globalmente sin tener que pasar props nivel por nivel (evito prop drilling)
// Importo useState y useEffect para mantener el estado de la sesión en memoria y sincronizarlo con el almacenamiento del navegador
import { createContext, useContext, useState, useEffect } from 'react';

// Creo el contexto global de autenticación inicializado en null (representa el estado "sin sesión activa")
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicialización perezosa (Lazy State Initialization): le paso una función a useState para que lea
  // el localStorage ÚNICAMENTE en el primer montaje del componente y no en cada re-renderizado.
  // Así persisto la sesión si el usuario recarga la página (F5).
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('padel_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Hago lo mismo para recuperar el token JWT almacenado previamente
  const [token, setToken] = useState(() => {
    return localStorage.getItem('padel_token') || null;
  });

  // Sincronización reactiva (Single Source of Truth): en lugar de manipular el localStorage disperso
  // en varias funciones, centralizo su escritura/limpieza en un useEffect que reacciona a cambios en 'user' o 'token'.
  useEffect(() => {
    if (user && token) {
      // Si ambos existen, persisto la sesión actualizada en el disco del navegador
      localStorage.setItem('padel_user', JSON.stringify(user));
      localStorage.setItem('padel_token', token);
    } else {
      // Si alguno pasa a null (por ejemplo, al cerrar sesión), limpio ambas claves para no dejar residuos huérfanos
      localStorage.removeItem('padel_user');
      localStorage.removeItem('padel_token');
    }
  }, [user, token]);

  // Método expuesto para iniciar sesión: actualiza el estado en memoria y dispara automáticamente el useEffect de persistencia
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  // Método expuesto para cerrar sesión: limpia el estado en memoria y el useEffect se encarga de borrar el localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // Proveo tanto los datos de sesión (user, token) como las acciones para modificarlos (login, logout) a toda la app
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook de consumo: encapsula useContext(AuthContext) para que los componentes no tengan que importar
// dos cosas ni preocuparse por validaciones nulas.
export function useAuth() {
  const context = useContext(AuthContext);
  // Cláusula de guarda para desarrollo: si alguien intenta usar useAuth() fuera del árbol envuelto por <AuthProvider>,
  // lanzo un error descriptivo inmediato en lugar de fallar silenciosamente con 'undefined'.
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}