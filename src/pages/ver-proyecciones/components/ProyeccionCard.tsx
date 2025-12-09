import type { Proyeccion } from "../hooks/useVerProyecciones";

interface ProyeccionCardProps {
  proyeccion: Proyeccion;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

const ProyeccionCard = ({ proyeccion, onDelete, onView, isSelected, onSelect }: ProyeccionCardProps) => {
  
  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      className={`group relative rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border-2
        ${isSelected 
          ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-200 ring-offset-2" 
          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg"
        }`}
      onClick={onSelect}
    >
      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
        isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white group-hover:border-blue-400'
      }`}>
        {isSelected && (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"/></svg>
        )}
      </div>

      <div className="p-6">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>

        <h2 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1" title={proyeccion.nombre}>
          {proyeccion.nombre}
        </h2>
        
        <div className="flex items-center gap-2 text-slate-500 text-xs mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>{new Date(proyeccion.fechaCreacion).toLocaleDateString("es-CL", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        <div className="h-px bg-slate-100 w-full mb-4"></div>

        <div className="flex justify-between items-center">
           <span className={`text-xs font-bold px-2 py-1 rounded ${isSelected ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
             {isSelected ? 'Seleccionada' : 'Click para seleccionar'}
           </span>

           <div className="flex gap-2">
             <button
               onClick={(e) => handleAction(e, () => onView(proyeccion.id))}
               className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
               title="Ver Detalle"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
             </button>
             <button
               onClick={(e) => handleAction(e, () => onDelete(proyeccion.id))}
               className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
               title="Eliminar"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProyeccionCard;