import { useState } from 'react';
import { Outlet, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function Layout() {
  // Consumo el estado global de autenticación y el contexto de tema claro/oscuro
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => setMenuAbierto(false);

  // Transformo el rol técnico de la base de datos a una etiqueta legible
  const formatearRol = (rol) => {
    const etiquetas = {
      admin: 'Admin',
      dueño_club: 'Dueño Club',
      organizador: 'Organizador',
      profesor: 'Profesor',
      jugador: 'Jugador'
    };
    return etiquetas[rol] || rol;
  };

  return (
    <div className="min-h-screen bg-surface font-display flex flex-col transition-colors duration-200">
      <header className="bg-white shadow-md sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" onClick={cerrarMenu} className="text-xl sm:text-2xl font-black text-primary">
            CATAMARCA <span className="text-secondary">PÁDEL</span>
          </Link>

          {/* CONTROLES MÓVILES: BOTÓN TEMA + HAMBURGUESA */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="p-2 rounded-lg bg-surface text-primary border border-gray-200 text-base"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <button
              type="button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="text-primary p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
              aria-label="Abrir menú"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* MENÚ DE ESCRITORIO */}
          <nav className="hidden md:flex items-center gap-5">
            <Link to="/torneos" className="font-semibold text-gray-600 hover:text-primary">
              Torneos
            </Link>
            <Link to="/profesores" className="font-semibold text-gray-600 hover:text-primary">
              Profesores
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {/* Acceso directo a la agenda de favoritos del usuario */}
                <Link
                  to="/admin?tab=favoritos"
                  className="font-semibold text-gray-600 hover:text-primary flex items-center gap-1"
                >
                  <span>❤️</span> Favoritos
                </Link>

                <Link
                  to="/admin"
                  className="text-primary font-bold hover:text-secondary transition-colors"
                >
                  Mi Panel
                </Link>

                {/* Saludo + Pastilla visual con el rol activo */}
                <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-gray-200">
                  <span className="text-sm font-bold text-gray-700">Hola, {user.nombre}</span>
                  <span className="bg-primary text-secondary text-[11px] font-extrabold uppercase px-2 py-0.5 rounded">
                    {formatearRol(user.rol)}
                  </span>
                </div>

                {/* Botón interruptor Theme Claro / Oscuro */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                  className="p-2 rounded-lg bg-surface border border-gray-200 hover:border-secondary transition-colors text-base cursor-pointer"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                <button
                  onClick={logout}
                  className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-200 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                  className="p-2 rounded-lg bg-surface border border-gray-200 hover:border-secondary transition-colors text-base cursor-pointer"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>

                <Link
                  to="/login"
                  className="bg-secondary text-white px-4 py-2 rounded-lg font-bold hover:bg-lime-600 transition-colors"
                >
                  Ingresar
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* MENÚ DESPLEGABLE EN CELULAR */}
        {menuAbierto && (
          <nav className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 shadow-lg">
            <Link
              to="/torneos"
              onClick={cerrarMenu}
              className="font-semibold text-gray-700 py-2 border-b border-gray-100"
            >
              Torneos
            </Link>
            <Link
              to="/profesores"
              onClick={cerrarMenu}
              className="font-semibold text-gray-700 py-2 border-b border-gray-100"
            >
              Profesores
            </Link>

            {user ? (
              <>
                <Link
                  to="/admin?tab=favoritos"
                  onClick={cerrarMenu}
                  className="font-semibold text-gray-700 py-2 border-b border-gray-100"
                >
                  ❤️ Mis Favoritos
                </Link>
                <Link
                  to="/admin"
                  onClick={cerrarMenu}
                  className="text-primary font-bold py-2 border-b border-gray-100"
                >
                  Mi Panel
                </Link>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">Hola, {user.nombre}</span>
                    <span className="bg-primary text-secondary text-[11px] font-extrabold uppercase px-2 py-0.5 rounded">
                      {formatearRol(user.rol)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      cerrarMenu();
                      logout();
                    }}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-sm"
                  >
                    Salir
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={cerrarMenu}
                className="bg-secondary text-primary text-center py-2.5 rounded-lg font-bold"
              >
                Ingresar
              </Link>
            )}
          </nav>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-primary text-white text-center py-6 mt-auto px-4">
        <p className="text-sm">© 2026 Catamarca Pádel - Circuito Amateur</p>
      </footer>
    </div>
  );
}

export default Layout;