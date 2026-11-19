import { Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Torneos from './pages/Torneos';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard'; // 👈 Importante
 import TorneoForm from './pages/TorneoForm'; // 👈 Importante

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="torneos" element={<Torneos />} />
        <Route path="login" element={<Login />} />
        
        {/* RUTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute allowedRoles={['organizador', 'dueño_club', 'admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/crear" element={<TorneoForm />} />
          <Route path="admin/editar/:id" element={<TorneoForm />} />
        </Route>

        <Route path="*" element={<h1 className="text-center mt-20 text-3xl">404 - Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}

export default App;