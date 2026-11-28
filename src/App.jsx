import { Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Torneos from './pages/Torneos';
import Clubes from './pages/Clubes';
import Historia from './pages/Historia';
import Profesores from './pages/Profesores';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import TorneoForm from './pages/TorneoForm';
import UsuarioForm from './pages/UsuarioForm'; 
import Sponsors from './pages/Sponsors';
import TorneoDetalle from './pages/TorneoDetalle'; 
import ClubDetalle from './pages/ClubDetalle';     



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas Públicas */}
       <Route index element={<Home />} />
        <Route path="torneos" element={<Torneos />} />
        <Route path="torneos/:id" element={<TorneoDetalle />} />
        <Route path="clubes" element={<Clubes />} />
        <Route path="clubes/:id" element={<ClubDetalle />} />     
        <Route path="historia" element={<Historia />} />
        <Route path="profesores" element={<Profesores />} />
        <Route path="sponsors" element={<Sponsors />} />
        <Route path="login" element={<Login />} />
        
        {/* Rutas Protegidas (Gestores y Admin) */}
        <Route element={<ProtectedRoute allowedRoles={['organizador', 'dueño_club', 'admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/crear" element={<TorneoForm />} />
          <Route path="admin/editar/:id" element={<TorneoForm />} />
        </Route>

        {/* Rutas Exclusivas de Administrador */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin/usuarios/crear" element={<UsuarioForm />} />
          <Route path="admin/usuarios/editar/:id" element={<UsuarioForm />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<h1 className="text-center mt-20 text-3xl">404 - Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}

export default App;