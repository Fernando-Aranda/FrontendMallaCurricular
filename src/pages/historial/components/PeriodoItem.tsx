import { Calendar } from "lucide-react";
import { EstadoBadge } from "./EstadoBadge";

interface Props {
  periodo: string;
  asignaturas: any[];
  nombresMap: Map<string, string>; // Nueva prop para buscar nombres
  isLast: boolean; 
}

function formatearPeriodo(periodo: string) {
  if (!periodo || periodo.length !== 6) return periodo;
  const year = periodo.slice(0, 4);
  const sem = periodo.slice(4, 6);
  if (sem === "10") return `1º Semestre ${year}`;
  if (sem === "20") return `2º Semestre ${year}`;
  if (sem === "15") return `Invierno ${year}`;
  if (sem === "25") return `Verano ${year}`;
  return periodo;
}

export const PeriodoItem = ({ periodo, asignaturas, nombresMap, isLast }: Props) => {
  const aprobadas = asignaturas.filter((a) => a.estado === "APROBADO").length;
  const reprobadas = asignaturas.filter((a) => a.estado === "REPROBADO").length;
  const inscritas = asignaturas.filter((a) => a.estado === "INSCRITO").length;

  return (
    <div className="relative pl-8 md:pl-10">
      
      {!isLast && (
        <div className="absolute left-[9px] md:left-[17px] top-8 bottom-[-40px] w-0.5 bg-slate-200"></div>
      )}

      <div className="absolute left-0 md:left-[8px] top-0 w-5 h-5 md:w-5 md:h-5 rounded-full border-4 border-slate-50 bg-blue-600 ring-4 ring-blue-50/50 z-10"></div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
        
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              {formatearPeriodo(periodo)}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5 ml-7">Código: {periodo}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
             {aprobadas > 0 && <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{aprobadas} Aprobadas</span>}
             {reprobadas > 0 && <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-50 text-red-700 border border-red-100">{reprobadas} Reprobadas</span>}
             {inscritas > 0 && <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">{inscritas} En Curso</span>}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 bg-white">
                <th className="px-6 py-3 font-semibold w-24">Código</th>
                <th className="px-6 py-3 font-semibold">Asignatura</th>
                <th className="px-6 py-3 font-semibold text-center">Tipo</th>
                <th className="px-6 py-3 font-semibold text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {asignaturas.map((r, i) => {
                // Buscamos el nombre real. Si no existe, usamos "Desconocido" o el código como fallback
                const nombreReal = nombresMap.get(r.codigo) || "Asignatura Externa / Electivo";

                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                    <td className="px-6 py-4 font-mono text-slate-500 font-medium text-xs">{r.codigo}</td>
                    <td className="px-6 py-4">
                       <p className="font-bold text-slate-700">{nombreReal}</p>
                       <p className="text-xs text-slate-400 mt-0.5">NRC: {r.nrc}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                        {r.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        <EstadoBadge estado={r.estado} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};