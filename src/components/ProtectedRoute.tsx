import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Este componente actúa como un guardián para las rutas.
 * Verifica si el usuario está autenticado (si existe un token).
 * Si no está autenticado, redirige a la página de login.
 * Si está autenticado, renderiza el componente hijo correspondiente a la ruta.
 */
const ProtectedRoute = () => {
  // 1. Obtenemos el estado de autenticación de nuestro AuthContext.
  //    Solo necesitamos saber si el 'token' existe.
  const { token, loading } = useAuth();

  // Opcional: Mostrar un spinner de carga mientras se verifica el token inicial.
  // Esto previene un "parpadeo" donde el usuario ve la página de login por un instante
  // antes de ser redirigido si ya tiene una sesión activa.
  if (loading) {
    // Puedes reemplazar esto con un componente de Spinner más elegante.
    return <div>Verificando sesión...</div>;
  }

  // 2. La lógica del guardián:
  //    Si no hay token, significa que el usuario no ha iniciado sesión.
  if (!token) {
    // 3. Usamos el componente <Navigate> de react-router-dom para redirigir al usuario.
    //    'to="/login"' es la ruta de destino.
    //    'replace' es importante: reemplaza la entrada actual en el historial de navegación
    //    en lugar de añadir una nueva. Esto evita que el usuario pueda usar el botón "atrás"
    //    del navegador para volver a la página protegida a la que intentó acceder.
    return <Navigate to="/login" replace />;
  }

  // 4. Si hay un token, el usuario tiene permiso.
  //    El componente <Outlet> es un marcador de posición que react-router-dom
  //    reemplaza por el componente de la ruta hija que coincidió con la URL.
  //    (Por ejemplo, el componente <Dashboard /> o <MallasPage />).
  return <Outlet />;
};

export default ProtectedRoute;