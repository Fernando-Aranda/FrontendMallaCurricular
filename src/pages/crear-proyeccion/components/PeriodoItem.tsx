import React from "react";
import RamoItem from "./RamoItem";

interface Ramo {
  codigoRamo: string;
  semestre: number;
}

interface OpcionRamo {
  codigo: string;
  asignatura: string;
  creditos?: number;
  nivel?: number;
  prereq?: string;
  historial?: { estado: string; periodo: string }[] | null;
}

interface Props {
  periodo: {
    catalogo: string;
    ramos: Ramo[];
  };
  index: number;
  agregarRamo: (i: number) => void;
  actualizarRamo: (
    iPeriodo: number,
    iRamo: number,
    field: any,
    value: any
  ) => void;

  opcionesPorNivel: {
    nivel: number;
    ramos: OpcionRamo[];
  }[];

  ramosSeleccionados: string[];
  ramosDisponibles: string[]; // Viene calculado desde el padre
}

export default function PeriodoItem({
  periodo,
  index,
  agregarRamo,
  actualizarRamo,
  opcionesPorNivel,
  ramosSeleccionados,
  ramosDisponibles,
}: Props) {
  return (
    <div className="border p-4 rounded-lg bg-gray-50 mb-4">
      <h4 className="font-bold mb-2">Período {index + 1}</h4>

      <input
        type="text"
        value={periodo.catalogo}
        readOnly
        className="w-full p-2 border rounded mb-3 bg-gray-100 text-gray-600"
      />

      <button
        type="button"
        onClick={() => agregarRamo(index)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mb-3"
      >
        + Agregar Ramo
      </button>

      {periodo.ramos.map((r, j) => (
        <RamoItem
          key={j}
          ramo={r}
          opcionesPorNivel={opcionesPorNivel}
          ramosSeleccionados={ramosSeleccionados}
          ramosDisponibles={ramosDisponibles}
          onChange={(field, value) => actualizarRamo(index, j, field, value)}
        />
      ))}
    </div>
  );
}