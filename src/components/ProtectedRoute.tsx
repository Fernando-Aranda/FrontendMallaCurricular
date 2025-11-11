import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Este componente actúa como un guardián para las rutas.
 * Verifica si el usuario está autenticado (si existe un token).
 * Si no está autenticado, redirige a la página de login.
 * Si está autenticado, renderiza el componente hijo correspondiente a la ruta.
 */

const ProtectedRoute = () => {
  const { token, loading } = useAuth();
  if (loading) {
    return <div>Verificando sesión...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;