import React from "react";
import PeriodoItem from "./PeriodoItem";

interface Ramo {
  codigoRamo: string;
  semestre: number;
}

interface Periodo {
  catalogo: string;
  ramos: Ramo[];
}

interface OpcionRamo {
  codigo: string;
  asignatura: string;
  creditos: number;
  nivel: number;
  prereq: string;
}

interface Props {
  periodos: Periodo[];
  agregarPeriodo: () => void;
  agregarRamo: (i: number) => void;
  actualizarRamo: (
    iPeriodo: number,
    iRamo: number,
    field: any,
    value: any
  ) => void;

  // ahora es POR PERIODO: array donde cada índice corresponde al periodo
  opcionesPorPeriodo: {
    nivel: number;
    ramos: OpcionRamo[];
  }[][];

  ramosSeleccionados: string[];
}

// 🔹 Función utilitaria para formatear el catalogo
function formatearPeriodo(catalogo: string) {
  if (!catalogo || catalogo.length !== 6) return catalogo;

  const year = catalogo.slice(0, 4);
  const sem = catalogo.slice(4, 6);

  if (sem === "10") return `Semestre 1, año ${year}`;
  if (sem === "20") return `Semestre 2, año ${year}`;
  if (sem === "15") return `Invierno ${year}`;
  if (sem === "25") return `Verano ${year}`;

  return catalogo;
}

export default function PeriodoList({
  periodos,
  agregarPeriodo,
  agregarRamo,
  actualizarRamo,
  opcionesPorPeriodo,
  ramosSeleccionados,
}: Props) {
  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Agregar Periodos y Ramos</h3>

      <button
        type="button"
        onClick={agregarPeriodo}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        + Agregar Período
      </button>

      {periodos.map((p, i) => (
        <PeriodoItem
          key={i}
          index={i}
          periodo={{ ...p, catalogo: formatearPeriodo(p.catalogo) }}
          agregarRamo={agregarRamo}
          actualizarRamo={actualizarRamo}
          // pasamos solo las opciones calculadas para este periodo
          opcionesPorNivel={opcionesPorPeriodo[i] ?? []}
          ramosSeleccionados={ramosSeleccionados}
        />
      ))}
    </div>
  );
}
