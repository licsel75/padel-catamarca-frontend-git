import { Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Torneos from './pages/Torneos';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import TorneoForm from './pages/TorneoForm';
import ClubForm from './pages/ClubForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="torneos" element={<Torneos />} />
        <Route path="login" element={<Login />} />
        
        {/* PANEL GENERAL: Accesible para cualquier usuario logueado (adapta pestañas según rol) */}
        <Route element={<ProtectedRoute allowedRoles={['jugador', 'organizador', 'dueño_club', 'admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        {/* RUTAS DE GESTIÓN: Solo organizadores, dueños de club y admin */}
        <Route element={<ProtectedRoute allowedRoles={['organizador', 'dueño_club', 'admin']} />}>
          <Route path="admin/crear" element={<TorneoForm />} />
          <Route path="admin/editar/:id" element={<TorneoForm />} />
          <Route path="admin/clubes/crear" element={<ClubForm />} />
          <Route path="admin/clubes/editar/:id" element={<ClubForm />} />
        </Route>

        <Route path="*" element={<h1 className="text-center mt-20 text-3xl">404 - Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}

export default App;