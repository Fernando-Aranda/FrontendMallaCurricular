import { Link } from "react-router-dom";

interface CarreraCardProps {
  carrera: {
    codigo: string;
    nombre: string;
  };
}

const CarreraCard = ({ carrera }: CarreraCardProps) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
    
    {/* Encabezado de la Carrera */}
    <div className="bg-slate-800 p-6 text-white bg-opacity-[0.98] relative overflow-hidden">
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
      
      <h2 className="text-2xl font-bold relative z-10">{carrera.nombre}</h2>
      <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded text-sm font-medium tracking-wider relative z-10">
        CÓDIGO: {carrera.codigo}
      </span>
    </div>

    {/* Cuerpo de Acciones */}
    <div className="p-6">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Acciones Rápidas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* GRUPO 1: INFORMACIÓN ACADÉMICA */}
        <Link
          to={`/malla/${carrera.codigo}`}
          className="group flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
        >
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
            {/* Icono Malla */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div className="ml-3">
            <span className="block text-slate-800 font-bold text-sm group-hover:text-blue-700">Ver Malla</span>
            <span className="block text-slate-500 text-xs mt-0.5">Plan de estudios</span>
          </div>
        </Link>

        <Link
          to={`/avance/${carrera.codigo}`}
          className="group flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-green-50 hover:border-green-200 transition-all duration-200"
        >
          <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
            {/* Icono Avance */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div className="ml-3">
            <span className="block text-slate-800 font-bold text-sm group-hover:text-green-700">Ver Avance</span>
            <span className="block text-slate-500 text-xs mt-0.5">Semáforo curricular</span>
          </div>
        </Link>

        <Link
          to={`/historial/${carrera.codigo}`}
          className="group flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-200 hover:border-slate-300 transition-all duration-200"
        >
          <div className="p-2 bg-slate-200 text-slate-600 rounded-lg group-hover:scale-110 transition-transform">
            {/* Icono Historial */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <div className="ml-3">
            <span className="block text-slate-800 font-bold text-sm group-hover:text-slate-900">Ver Historial</span>
            <span className="block text-slate-500 text-xs mt-0.5">Historial académico</span>
          </div>
        </Link>

        {/* GRUPO 2: PLANIFICACIÓN */}
        
        {/* === NUEVA OPCIÓN: PROYECCIÓN AUTOMÁTICA === */}
        <Link
          to={`/proyeccion-automatica/${carrera.codigo}`}
          className="group flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 relative overflow-hidden"
        >

          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
            {/* Icono Sparkles/Inteligencia */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>
          </div>
          <div className="ml-3">
            <span className="block text-slate-800 font-bold text-sm group-hover:text-indigo-700">Proyección Auto</span>
            <span className="block text-slate-500 text-xs mt-0.5">Ruta optimizada</span>
          </div>
        </Link>

        <Link
          to={`/crear-proyeccion/${carrera.codigo}`}
          className="group flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 transition-all duration-200"
        >
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:scale-110 transition-transform">
            {/* Icono Crear */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div className="ml-3">
            <span className="block text-slate-800 font-bold text-sm group-hover:text-orange-700">Crear Manual</span>
            <span className="block text-slate-500 text-xs mt-0.5">Arma tu horario</span>
          </div>
        </Link>

        <Link
          to={`/ver-proyecciones/${carrera.codigo}`}
          className="group flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200"
        >
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
            {/* Icono Mis Proyecciones */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div className="ml-3">
            <span className="block text-slate-800 font-bold text-sm group-hover:text-purple-700">Mis Proyecciones</span>
            <span className="block text-slate-500 text-xs mt-0.5">Guardadas</span>
          </div>
        </Link>

      </div>
    </div>
  </div>
);

export default CarreraCard;