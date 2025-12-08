import React from "react";

interface Historial {
  estado: string;
  periodo: string;
}

interface RamoOption {
  codigo: string;
  asignatura: string;
  creditos?: number; // 👈 Nos aseguramos de leer los créditos
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
    <div className="bg-white border border-gray-200 p-2 rounded mb-2 shadow-sm">
      <select
        value={ramo.codigoRamo}
        onChange={(e) => onChange("codigoRamo", e.target.value)}
        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
      >
        <option value="" disabled>
          Selecciona un Ramo...
        </option>

        {opcionesPorNivel.map((grupo) => (
          <optgroup key={grupo.nivel} label={`Nivel ${grupo.nivel}`}>
            {grupo.ramos
              .filter((r) => {
                // 1️⃣ No mostrar ramos ya aprobados/inscritos
                if (r.historial?.some((h) => ["APROBADO", "INSCRITO", "CONVALIDADO"].includes(h.estado))) return false;

                // 2️⃣ No mostrar ramos ya seleccionados en la proyección (excepto el actual)
                if (ramosSeleccionados.includes(r.codigo) && r.codigo !== ramo.codigoRamo) return false;

                // 3️⃣ Prerrequisitos estrictos
                if (r.prereq) {
                  const prereqs = r.prereq.split(",").map((p) => p.trim());
                  if (!prereqs.every((p) => ramosDisponibles.includes(p))) return false;
                }

                return true;
              })
              .map((r) => (
                <option key={r.codigo} value={r.codigo}>
                  {/* 🔹 AQUÍ ES EL CAMBIO: Mostramos nombre y créditos */}
                  {r.asignatura} ({r.creditos || 0} CR)
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}