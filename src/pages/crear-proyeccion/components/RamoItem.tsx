import React from "react";

interface Historial {
  estado: string;
  periodo: string;
}

interface RamoOption {
  codigo: string;
  asignatura: string; 
  creditos?: number;
  nivel?: number;
  prereq?: string;
  historial?: Historial[] | null;
}

interface Props {
  ramo: {
    codigoRamo: string;
    semestre: number;
  };
  opcionesPorNivel: {
    nivel: number;
    ramos: RamoOption[];
  }[];
  ramosSeleccionados: string[];
  ramosDisponibles: string[];
  nivelEstudiante: number;
  onChange: (field: "codigoRamo", value: string, nombre?: string) => void;
  onRemove: () => void;
}

export default function RamoItem({
  ramo,
  opcionesPorNivel,
  ramosSeleccionados,
  ramosDisponibles,
  nivelEstudiante,
  onChange,
  onRemove,
}: Props) {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoCodigo = e.target.value;
    
    let nombreEncontrado = "";
    if (nuevoCodigo) {
      for (const grupo of opcionesPorNivel) {
        const encontrado = grupo.ramos.find(r => r.codigo === nuevoCodigo);
        if (encontrado) {
          nombreEncontrado = encontrado.asignatura;
          break;
        }
      }
    }

    onChange("codigoRamo", nuevoCodigo, nombreEncontrado);
  };

  return (
    <div className="bg-white border border-gray-200 p-2 rounded mb-2 shadow-sm flex items-center gap-2">
      <select
        value={ramo.codigoRamo}
        onChange={handleChange} 
        className={`flex-1 p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white ${
          ramo.codigoRamo ? "border-blue-300 text-gray-900" : "border-gray-300 text-gray-500"
        }`}
      >
        <option value="" className="text-gray-400">
          {ramo.codigoRamo ? "-- Deseleccionar --" : "Selecciona un Ramo..."}
        </option>

        {opcionesPorNivel.map((grupo) => {
          if (grupo.nivel > nivelEstudiante + 2) return null;

          const ramosValidos = grupo.ramos.filter((r) => {
            if (r.historial?.some((h) => ["APROBADO", "INSCRITO", "CONVALIDADO"].includes(h.estado))) return false;
            if (ramosSeleccionados.includes(r.codigo) && r.codigo !== ramo.codigoRamo) return false;
            if (r.prereq) {
              const prereqs = r.prereq.split(",").map((p) => p.trim());
              if (!prereqs.every((p) => ramosDisponibles.includes(p))) return false;
            } else {
              if ((r.nivel || 0) > nivelEstudiante) return false;
            }
            return true;
          });

          if (ramosValidos.length === 0) return null;

          return (
            <optgroup key={grupo.nivel} label={`Nivel ${grupo.nivel}`}>
              {ramosValidos.map((r) => (
                <option key={r.codigo} value={r.codigo} className="text-gray-900">
                  {r.asignatura} ({r.creditos || 0} CR)
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>

      <button
        type="button"
        onClick={onRemove}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}