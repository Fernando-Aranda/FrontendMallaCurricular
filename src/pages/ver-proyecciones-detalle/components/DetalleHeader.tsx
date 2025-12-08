import { Link } from "react-router-dom";

interface DetalleHeaderProps {
  nombreProyeccion: string;
  codigoCarrera: string;
  fechaCreacion?: string;
}

const DetalleHeader = ({ nombreProyeccion, codigoCarrera, fechaCreacion }: DetalleHeaderProps) => {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-6">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-500 mb-2 flex items-center gap-2">
          <Link to="/home" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <span className="text-slate-300">/</span>
          <Link to={`/ver-proyecciones/${codigoCarrera}`} className="hover:text-blue-600 transition-colors">Mis Proyecciones</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-medium truncate max-w-[150px] md:max-w-none">
            {nombreProyeccion}
          </span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {nombreProyeccion}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
               <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold font-mono">
                 {codigoCarrera}
               </span>
               {fechaCreacion && (
                 <span className="flex items-center gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                   {new Date(fechaCreacion).toLocaleDateString()}
                 </span>
               )}
            </div>
          </div>

          <Link
            to={`/ver-proyecciones/${codigoCarrera}`}
            className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors bg-white border border-slate-300 hover:border-blue-400 px-4 py-2 rounded-lg text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Volver a Lista
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetalleHeader;