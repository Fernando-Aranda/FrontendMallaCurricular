import React from "react";

interface Historial {
  estado: string;
  periodo: string;
}

interface RamoOption {
  codigo: string;
  asignatura: string;
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

  onChange: (field: "codigoRamo", value: string) => void;
}

export default function RamoItem({
  ramo,
  opcionesPorNivel,
  ramosSeleccionados,
  ramosDisponibles,
  onChange,
}: Props) {
  return (
    <div className="bg-white border p-3 rounded mb-2">
      <select
        value={ramo.codigoRamo}
        onChange={(e) => onChange("codigoRamo", e.target.value)}
        className="w-full p-2 border rounded mb-2 bg-white"
      >
        <option value="" disabled>
          Selecciona un Ramo
        </option>

        {opcionesPorNivel.map((grupo) => (
          <optgroup key={grupo.nivel} label={`Nivel ${grupo.nivel}`}>
            {grupo.ramos
              .filter((r) => {
                // 1️⃣ No mostrar ramos ya aprobados/inscritos en el historial (API)
                if (r.historial?.some((h) => ["APROBADO", "INSCRITO", "CONVALIDADO"].includes(h.estado))) return false;

                // 2️⃣ No mostrar ramos ya seleccionados en la proyección (excepto si es el mismo input actual)
                if (ramosSeleccionados.includes(r.codigo) && r.codigo !== ramo.codigoRamo) return false;

                // 3️⃣ Prerrequisitos estrictos: Deben estar en 'ramosDisponibles'
                // (que ahora contiene SOLO historial + periodos ANTERIORES)
                if (r.prereq) {
                  const prereqs = r.prereq.split(",").map((p) => p.trim());
                  // Si algún prerequisito no está en la lista de disponibles, ocultar ramo
                  if (!prereqs.every((p) => ramosDisponibles.includes(p))) return false;
                }

                return true;
              })
              .map((r) => (
                <option key={r.codigo} value={r.codigo}>
                  {r.asignatura}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}