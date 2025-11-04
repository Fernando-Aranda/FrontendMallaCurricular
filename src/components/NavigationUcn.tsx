import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavigationUcnProps {
  codigoCarrera?: string;
}

const NavigationUcn: React.FC<NavigationUcnProps> = ({ codigoCarrera }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinkClass = (path: string, exact: boolean = false) => {
    // Si se requiere una coincidencia exacta (para el Dashboard)
    if (exact) {
      return location.pathname === path
        ? 'text-orange-400 font-semibold'
        : 'hover:text-orange-400';
    }
    // Para los demás, que empiezan con una ruta base
    return location.pathname.startsWith(path)
      ? 'text-orange-400 font-semibold'
      : 'hover:text-orange-400';
  };

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        {/* El logo sigue llevando al dashboard */}
        <Link to="/home" className="font-bold text-xl">
          App Mallas UCN
        </Link>

        {/* Contenedor para todos los enlaces de texto */}
        <div className="flex items-center gap-4">
          {/* 1. ENLACE AÑADIDO: Dashboard (Global) */}
          <Link to="/home" className={getLinkClass('/dashboard', true)}>
            Home
          </Link>
          
          {/* Solo mostramos la barra separadora y los enlaces de carrera si hay un código */}
          {codigoCarrera && (
            <>
              {/* Barra separadora para mayor claridad visual */}
              <span className="text-slate-500">|</span>

              {/* Enlaces específicos de la carrera */}
              <Link to={`/malla/${codigoCarrera}`} className={getLinkClass(`/malla/${codigoCarrera}`)}>
                Malla
              </Link>
              <Link to={`/avance/${codigoCarrera}`} className={getLinkClass(`/avance/${codigoCarrera}`)}>
                Avance
              </Link>
              <Link to={`/crear-proyeccion/${codigoCarrera}`} className={getLinkClass(`/crear-proyeccion/${codigoCarrera}`)}>
                Crear Proyección
              </Link>
              {/* 2. ENLACE AÑADIDO: Ver Proyecciones */}
              <Link to={`/ver-proyecciones/${codigoCarrera}`} className={getLinkClass(`/ver-proyecciones/${codigoCarrera}`)}>
                Mis Proyecciones
              </Link>
            </>
          )}
        </div>
      </div>
      <button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded">
        Cerrar Sesión
      </button>
    </nav>
  );
};

export default NavigationUcn;