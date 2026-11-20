import { createContext, useContext, useState, useEffect } from 'react';

// Creo el contexto global para compartir el estado del tema (claro/oscuro) en toda la aplicación
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Leo la preferencia guardada en localStorage; si no existe, arranco en modo 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Sincronizo la clase 'dark' en la etiqueta raíz <html> y guardo la elección en localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook para consumir el tema fácilmente desde cualquier componente
export const useTheme = () => useContext(ThemeContext);