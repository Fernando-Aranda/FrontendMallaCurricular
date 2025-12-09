import { Link } from "react-router-dom";

interface ProyeccionesHeaderProps {
  codigoCarrera?: string;
  count?: number; // Prop opcional para mostrar cantidad
}

const ProyeccionesHeader = ({ codigoCarrera, count = 0 }: ProyeccionesHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Mis Proyecciones
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold font-mono">
            {codigoCarrera}
          </span>
          <span className="text-slate-400 text-sm">•</span>
          <span className="text-slate-500 text-sm">
            {count} {count === 1 ? 'Planificación guardada' : 'Planificaciones guardadas'}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        {/* Enlace rápido a Proyección Auto */}
        <Link
          to={`/proyeccion-automatica/${codigoCarrera}`}
          className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Generar Auto
        </Link>

        <Link
          to={`/crear-proyeccion/${codigoCarrera}`}
          className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nueva Manual
        </Link>
      </div>
    </div>
  );
};

export default ProyeccionesHeader;