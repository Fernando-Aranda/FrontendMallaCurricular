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
  
  // 1️⃣ Obtener el catálogo completo.
  // Tu JSON muestra que toda la malla está en la posición [0]. 
  // Usamos esa misma lista de opciones para TODOS los periodos.
  const catalogoCompleto = opcionesPorPeriodo[0] ?? [];

  // 2️⃣ Calcular lógica de prerrequisitos acumulativos estrictos
  const ramosDisponiblesPorPeriodo = useMemo(() => {
    const disponiblesPorPeriodo: string[][] = [];
    
    // Paso A: Obtener historial base (ramos ya aprobados/inscritos/convalidados en la BD)
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

    // 'acumulado' representa la "mochila" de conocimientos que tiene el alumno 
    // ANTES de entrar al periodo actual del bucle.
    let acumulado = [...historialBase];

    // Paso B: Iterar periodos secuencialmente
    for (let i = 0; i < periodos.length; i++) {
      // 1. Lo que está disponible para ELIGIR en este periodo 'i' es lo acumulado hasta ayer.
      disponiblesPorPeriodo.push([...acumulado]);

      // 2. Lo que seleccionamos en este periodo 'i', se suma al acumulado para el periodo 'i+1'.
      const ramosSeleccionadosEnEstePeriodo = periodos[i].ramos
        .map((r) => r.codigoRamo)
        .filter((codigo) => codigo !== ""); // Evitar strings vacíos

      acumulado = [...acumulado, ...ramosSeleccionadosEnEstePeriodo];
    }

    return disponiblesPorPeriodo;
  }, [catalogoCompleto, periodos]); 

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
          // 🔹 CORRECCIÓN CRÍTICA: Pasamos el catálogo completo, no [i] (que era undefined para periodo 2)
          opcionesPorNivel={catalogoCompleto}
          ramosSeleccionados={ramosSeleccionados}
          // 🔹 Pasamos la lista calculada que solo incluye historial + periodos ANTERIORES
          ramosDisponibles={ramosDisponiblesPorPeriodo[i]}
        />
      ))}
    </div>
  );
}