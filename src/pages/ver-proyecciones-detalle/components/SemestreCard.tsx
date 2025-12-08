import type { RamoProyectado } from "../hooks/useVerProyeccionDetalle";

interface SemestreCardProps {
  semestre: string;
  ramos: RamoProyectado[];
  isLast?: boolean; // Para saber si dibujar la línea conectora hacia abajo
}

const SemestreCard = ({ semestre, ramos, isLast }: SemestreCardProps) => {
  return (
    <div className="relative pl-8 md:pl-0">
      
      {/* LÍNEA DE TIEMPO (Solo visible en desktop para conectar tarjetas) */}
      {!isLast && (
        <div className="hidden md:block absolute left-[23px] top-10 bottom-[-32px] w-0.5 bg-slate-200 z-0"></div>
      )}

      {/* TÍTULO DEL SEMESTRE (Badge Circular) */}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md ring-4 ring-white border border-blue-100 flex-shrink-0">
          {semestre}
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Semestre {semestre}
        </h2>
        <span className="ml-auto text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
          {ramos.length} Asignaturas
        </span>
      </div>

      {/* CONTENEDOR DE RAMOS (Grid) */}
      <div className="md:ml-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {ramos.map((ramo, index) => (
          <div 
            key={index} 
            className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {ramo.codigoRamo}
              </span>
              {/* Si tuvieras créditos, irían aquí */}
            </div>
            
            <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-blue-800">
              {ramo.nombreAsignatura|| "Asignatura sin nombre"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemestreCard;