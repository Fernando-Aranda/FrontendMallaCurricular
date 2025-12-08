import type { Proyeccion } from "../hooks/useVerProyeccionDetalle";

interface InfoProyeccionProps {
  proyeccion: Proyeccion;
}

const InfoProyeccion = ({ proyeccion }: InfoProyeccionProps) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg mb-8">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Resumen General</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-slate-400 text-xs mb-1">Estudiante</p>
          <p className="font-mono font-bold text-lg">{proyeccion.rut}</p>
        </div>
        
        <div>
          <p className="text-slate-400 text-xs mb-1">Carrera</p>
          <p className="font-bold text-lg">{proyeccion.codigoCarrera}</p>
        </div>

        <div>
           <p className="text-slate-400 text-xs mb-1">Total Periodos</p>
           {/* Calculamos semestres únicos */}
           <p className="font-bold text-lg text-blue-300">
             {new Set(proyeccion.ramos.map(r => r.semestre)).size}
           </p>
        </div>

        <div>
           <p className="text-slate-400 text-xs mb-1">Total Asignaturas</p>
           <p className="font-bold text-lg text-green-300">
             {proyeccion.ramos.length}
           </p>
        </div>
      </div>
    </div>
  );
};

export default InfoProyeccion;