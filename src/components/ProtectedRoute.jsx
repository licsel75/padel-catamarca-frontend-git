// Importo Navigate para hacer redirecciones declarativas desde el JSX cuando falla una validación de acceso
// Importo Outlet como el "espacio reservado" donde React Router renderizará las rutas hijas si el usuario pasa los controles
import { Navigate, Outlet } from 'react-router';
// Importo mi hook useAuth para leer en tiempo real el estado de sesión (user y token) desde el contexto global
import { useAuth } from '../context/AuthContext';

// Creo este componente "Guardia de Rutas" (Route Guard) que actúa como envoltorio padre en el enrutador.
// Recibe opcionalmente un array 'allowedRoles' para soportar tanto rutas que solo piden estar logueado
// como rutas restringidas a roles específicos (ej: allowedRoles={['admin', 'organizador']}).
function ProtectedRoute({ allowedRoles }) {
  // Extraigo los datos de sesión actuales desde mi AuthContext
  const { user, token } = useAuth();

  // 1. Primera barrera (Autenticación): verifico que existan tanto el token JWT como los datos del usuario.
  // Uso la prop 'replace' en <Navigate> para reemplazar la ruta protegida en el historial del navegador;
  // así, si el usuario presiona el botón "Atrás" desde el login, no queda atrapado en un bucle de redirección.
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Segunda barrera (Autorización / RBAC en UI): si la ruta definió roles permitidos y el rol del usuario
  // no está en esa lista blanca, lo redirijo al inicio para evitar que vea pantallas administrativas que no le corresponden.
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  // 3. Acceso concedido: renderizo <Outlet />, que le da paso al componente hijo configurado dentro de esta ruta en App.jsx
  return <Outlet />;
}

export default ProtectedRoute;