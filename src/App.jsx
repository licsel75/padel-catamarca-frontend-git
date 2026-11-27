import { Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Torneos from './pages/Torneos';
import Clubes from './pages/Clubes';       //  NUEVA
import Historia from './pages/Historia';   // NUEVA
import Profesores from './pages/Profesores'; // ESTA ES LA QUE FALTABA
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import TorneoForm from './pages/TorneoForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rutas Públicas */}
        <Route index element={<Home />} />
        <Route path="torneos" element={<Torneos />} />
        <Route path="clubes" element={<Clubes />} />
        <Route path="historia" element={<Historia />} />
        <Route path="profesores" element={<Profesores />} /> 
        <Route path="login" element={<Login />} />
        
        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute allowedRoles={['organizador', 'dueño_club', 'admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/crear" element={<TorneoForm />} />
          <Route path="admin/editar/:id" element={<TorneoForm />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<h1 className="text-center mt-20 text-3xl">404 - Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}

export default App;