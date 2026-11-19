import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ allowedRoles }) {
  const { user, token } = useAuth();

  // 1. Si no hay token, lo mandamos al login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta requiere un rol específico y el usuario no lo tiene
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />; // Lo mandamos al inicio
  }

  // 3. Si pasó todo, lo dejamos ver la página
  return <Outlet />;
}

export default ProtectedRoute;