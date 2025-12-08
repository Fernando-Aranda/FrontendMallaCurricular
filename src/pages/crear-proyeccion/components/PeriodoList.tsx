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
  historial?: { estado: string; periodo: string }[] | null;
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

  opcionesPorPeriodo: {
    nivel: number;
    ramos: OpcionRamo[];
  }[][];

  ramosSeleccionados: string[];
}

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
  // 🔹 Calculamos ramos disponibles acumulando aprobados/inscritos y seleccionados previos
  const ramosDisponiblesPorPeriodo = periodos.map((p, i) => {
    const acumulado: string[] = [];

    // Ramos de periodos anteriores
    for (let j = 0; j < i; j++) {
      acumulado.push(...periodos[j].ramos.map((r) => r.codigoRamo));
    }

    // Ramos aprobados/inscritos según opcionesPorPeriodo
    opcionesPorPeriodo[i]?.forEach((grupo) =>
      grupo.ramos.forEach((r) => {
        if (r.historial?.some((h) => h.estado === "APROBADO" || h.estado === "INSCRITO")) {
          acumulado.push(r.codigo);
        }
      })
    );

    return acumulado;
  });

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
          opcionesPorNivel={opcionesPorPeriodo[i] ?? []}
          ramosSeleccionados={ramosSeleccionados}
          ramosDisponibles={[
            ...ramosDisponiblesPorPeriodo[i],
            ...p.ramos.map((r) => r.codigoRamo), // también ramos ya seleccionados en este periodo
          ]}
        />
      ))}
    </div>
  );
}
