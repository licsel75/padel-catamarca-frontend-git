import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicialización lazy: lee del localStorage si ya estaba logueado
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('padel_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('padel_token') || null;
  });

  // Guardar en el disco cuando el estado cambie
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('padel_user', JSON.stringify(user));
      localStorage.setItem('padel_token', token);
    } else {
      localStorage.removeItem('padel_user');
      localStorage.removeItem('padel_token');
    }
  }, [user, token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}