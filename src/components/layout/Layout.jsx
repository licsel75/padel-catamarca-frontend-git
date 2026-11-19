import { Outlet, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';

function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface font-display flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-primary">
            CATAMARCA <span className="text-secondary">PÁDEL</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/torneos" className="font-semibold text-gray-600 hover:text-primary">Torneos</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/admin" 
                  className="text-primary font-bold hover:text-secondary transition-colors"
                >
                  Mi Panel
                </Link>

                <span className="text-sm font-bold text-gray-700">Hola, {user.nombre}</span>
                <button onClick={logout} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-200">
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-secondary text-white px-4 py-2 rounded-lg font-bold hover:bg-lime-600 transition-colors">
                Ingresar
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-primary text-white text-center py-6 mt-auto">
        <p>© 2026 Catamarca Pádel - Circuito Amateur</p>
      </footer>
    </div>
  );
}

export default Layout;