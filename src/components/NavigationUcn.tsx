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

  const getLinkClasses = (path: string, exact: boolean = false) => {
    const isActive = exact 
      ? location.pathname === path 
      : location.pathname.startsWith(path);

    const baseClasses = "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap";
    
    return isActive
      ? `${baseClasses} bg-slate-800 text-orange-400 shadow-sm ring-1 ring-slate-700`
      : `${baseClasses} text-slate-400 hover:text-white hover:bg-slate-800/50`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center flex-1 overflow-x-auto no-scrollbar mask-gradient pr-4">
            
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-3 flex-shrink-0 group mr-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/20 transition-all">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="font-bold text-lg text-white tracking-tight hidden md:block">
                Mallas UCN
              </span>
            </Link>
            <div className="h-8 w-px bg-slate-800 flex-shrink-0 mx-6 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <Link to="/home" className={getLinkClasses('/home', true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Inicio
              </Link>
              {codigoCarrera && (
                <>
                  <Link to={`/malla/${codigoCarrera}`} className={getLinkClasses(`/malla/${codigoCarrera}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Malla
                  </Link>

                  <Link to={`/avance/${codigoCarrera}`} className={getLinkClasses(`/avance/${codigoCarrera}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    Avance
                  </Link>
                  <Link to={`/proyeccion-automatica/${codigoCarrera}`} className={getLinkClasses(`/proyeccion-automatica/${codigoCarrera}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300 font-bold">
                      Auto
                    </span>
                  </Link>
                  <Link to={`/crear-proyeccion/${codigoCarrera}`} className={getLinkClasses(`/crear-proyeccion/${codigoCarrera}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    Manual
                  </Link>
                  <Link to={`/ver-proyecciones/${codigoCarrera}`} className={getLinkClasses(`/ver-proyecciones/${codigoCarrera}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    Guardadas
                  </Link>
                  <Link to={`/historial/${codigoCarrera}`} className={getLinkClasses(`/historial/${codigoCarrera}`)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Historial
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="pl-6 border-l border-slate-800 ml-2 hidden sm:block">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-4 py-2.5 rounded-lg transition-all text-sm font-bold"
            >
              <span>Salir</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
           <button 
              onClick={handleLogout} 
              className="sm:hidden text-slate-400 hover:text-red-400 p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>

        </div>
      </div>
    </nav>
  );
};

export default NavigationUcn;