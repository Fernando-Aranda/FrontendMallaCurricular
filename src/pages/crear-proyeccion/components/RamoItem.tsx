import React from "react";

interface Props {
  ramo: {
    codigoRamo: string;
    semestre: number;
  };

  opcionesPorNivel: {
    nivel: number;
    ramos: { codigo: string; asignatura: string }[];
  }[];

  ramosSeleccionados: string[];

  onChange: (field: "codigoRamo", value: string) => void;
}

export default function RamoItem({
  ramo,
  opcionesPorNivel,
  ramosSeleccionados,
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
              .filter(
                (r) =>
                  !ramosSeleccionados.includes(r.codigo) ||
                  r.codigo === ramo.codigoRamo
              )
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
