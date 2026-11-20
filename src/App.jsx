import { Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Torneos from './pages/Torneos';
import TorneoDetalle from './pages/TorneoDetalle';
import ClubDetalle from './pages/ClubDetalle';
import Profesores from './pages/Profesores';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import TorneoForm from './pages/TorneoForm';
import ClubForm from './pages/ClubForm';
import ProfesorForm from './pages/ProfesorForm';
import UserForm from './pages/UserForm';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="torneos" element={<Torneos />} />
        <Route path="torneos/:id" element={<TorneoDetalle />} />
        <Route path="clubes/:id" element={<ClubDetalle />} />
        <Route path="profesores" element={<Profesores />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />

        {/* PANEL GENERAL: Accesible para cualquier usuario logueado */}
        <Route element={<ProtectedRoute allowedRoles={['jugador', 'profesor', 'organizador', 'dueño_club', 'admin']} />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin/usuarios/editar/:id" element={<UserForm />} />
        </Route>

        {/* RUTAS DE GESTIÓN DE TORNEOS Y CLUBES */}
        <Route element={<ProtectedRoute allowedRoles={['organizador', 'dueño_club', 'admin']} />}>
          <Route path="admin/crear" element={<TorneoForm />} />
          <Route path="admin/editar/:id" element={<TorneoForm />} />
          <Route path="admin/clubes/crear" element={<ClubForm />} />
          <Route path="admin/clubes/editar/:id" element={<ClubForm />} />
        </Route>

        {/* 👇 2. RUTA DE GESTIÓN DEL PROFESOR: Solo profesores aprobados y admin */}
        <Route element={<ProtectedRoute allowedRoles={['profesor', 'admin']} />}>
          <Route path="admin/mi-anuncio-profesor" element={<ProfesorForm />} />
        </Route>

        <Route path="*" element={<h1 className="text-center mt-20 text-3xl">404 - Página no encontrada</h1>} />
      </Route>
    </Routes>
  );
}

export default App;