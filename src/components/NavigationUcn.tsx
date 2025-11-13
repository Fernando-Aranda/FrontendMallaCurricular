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
    if (exact) {
      return location.pathname === path
        ? 'text-orange-400 font-semibold'
        : 'hover:text-orange-400';
    }
    return location.pathname.startsWith(path)
      ? 'text-orange-400 font-semibold'
      : 'hover:text-orange-400';
  };

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <Link to="/home" className="font-bold text-xl">
          App Mallas UCN
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/home" className={getLinkClass('/home', true)}>
            Home
          </Link>
          
          {codigoCarrera && (
            <>
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
              <Link to={`/ver-proyecciones/${codigoCarrera}`} className={getLinkClass(`/ver-proyecciones/${codigoCarrera}`)}>
                Mis Proyecciones
              </Link>
              <Link to={`/historial/${codigoCarrera}`} className={getLinkClass(`/historial/${codigoCarrera}`)}>
                Historial
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