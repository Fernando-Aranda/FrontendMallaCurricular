import React, { useMemo } from "react";
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
  eliminarUltimoPeriodo: () => void; // 👈 Nueva prop
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
  eliminarUltimoPeriodo, // 👈 Destructurar
  agregarRamo,
  actualizarRamo,
  opcionesPorPeriodo,
  ramosSeleccionados,
}: Props) {
  
  const catalogoCompleto = opcionesPorPeriodo[0] ?? [];

  const ramosDisponiblesPorPeriodo = useMemo(() => {
    const disponiblesPorPeriodo: string[][] = [];
    const historialBase: string[] = [];
    catalogoCompleto.forEach((nivel) => {
      nivel.ramos.forEach((r) => {
        if (
          r.historial?.some((h) =>
            ["APROBADO", "INSCRITO", "CONVALIDADO"].includes(h.estado)
          )
        ) {
          historialBase.push(r.codigo);
        }
      });
    });

    let acumulado = [...historialBase];

    for (let i = 0; i < periodos.length; i++) {
      disponiblesPorPeriodo.push([...acumulado]);
      const ramosSeleccionadosEnEstePeriodo = periodos[i].ramos
        .map((r) => r.codigoRamo)
        .filter((codigo) => codigo !== "");
      acumulado = [...acumulado, ...ramosSeleccionadosEnEstePeriodo];
    }

    return disponiblesPorPeriodo;
  }, [catalogoCompleto, periodos]); 

  return (
    <div className="mt-6">
      <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Planificación</h3>

      {/* 🔹 Botones de Control de Periodos */}
      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={agregarPeriodo}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition shadow-sm flex items-center justify-center gap-2"
        >
          <span>+</span> Agregar Periodo
        </button>

        {periodos.length > 0 && (
          <button
            type="button"
            onClick={eliminarUltimoPeriodo}
            className="px-4 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
            title="Borrar el último periodo agregado"
          >
            Borrar Último
          </button>
        )}
      </div>

      {periodos.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-4 italic border-2 border-dashed border-gray-200 rounded-lg">
          No hay periodos agregados.
        </p>
      )}

      {periodos.map((p, i) => (
        <PeriodoItem
          key={i}
          index={i}
          periodo={{ ...p, catalogo: formatearPeriodo(p.catalogo) }}
          agregarRamo={agregarRamo}
          actualizarRamo={actualizarRamo}
          opcionesPorNivel={catalogoCompleto}
          ramosSeleccionados={ramosSeleccionados}
          ramosDisponibles={ramosDisponiblesPorPeriodo[i]}
        />
      ))}
    </div>
  );
}