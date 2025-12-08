import React from "react";

interface Historial {
  estado: string;
  periodo: string;
}

interface RamoOption {
  codigo: string;
  asignatura: string;
  prereq?: string;
  historial?: Historial[] | null; // múltiples historiales
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
  ramosDisponibles: string[]; // ramos que ya se consideran aprobados/inscritos para el periodo

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
                // 1️⃣ No mostrar ramos ya aprobados o inscritos
                const tieneAprobadoOInscrito = r.historial?.some(
                  (h) => h.estado === "APROBADO" || h.estado === "INSCRITO"
                );
                if (tieneAprobadoOInscrito) return false;

                // 2️⃣ Mantener ramos ya seleccionados en este periodo
                if (ramosSeleccionados.includes(r.codigo) && r.codigo !== ramo.codigoRamo)
                  return false;

                // 3️⃣ Revisar prerrequisitos
                if (r.prereq) {
                  const prereqs = r.prereq.split(",").map((p) => p.trim());
                  const prereqsCumplidos = prereqs.every((p) =>
                    ramosDisponibles.includes(p)
                  );
                  if (!prereqsCumplidos) return false;
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
