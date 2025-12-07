import { useMemo } from "react";
import { useMallas } from "./useMallas";
import { useAvance } from "./useAvance";
import type { Malla } from "../types/mallas";

export interface RamosPorNivel {
  nivel: number;
  ramos: (Malla & {
    historial?: {
      estado: string;
      periodo: string;
    };
  })[];
}

/* ============================================================
   🔍 Función profesional para desglosar periodos UCN
   Formato esperado: YYYYSS (ej: 202320 → año 2023, semestre 20)
   ============================================================ */
export function desglosarPeriodo(periodo: string) {
  if (!/^\d{6}$/.test(periodo)) {
    return {
      periodo,
      year: 0,
      semestre: 0,
      valido: false
    };
  }

  const year = Number(periodo.slice(0, 4));
  const semestre = Number(periodo.slice(4, 6)); // puede ser 10, 20, 15

  return {
    periodo,
    year,
    semestre,
    valido: true
  };
}

/* ============================================================
   🔍 Función para ordenar periodos correctamente
   ============================================================ */
export function ordenarPeriodos(periodos: string[]) {
  return [...periodos]
    .map((p) => desglosarPeriodo(p))
    .filter((p) => p.valido)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.semestre - b.semestre;
    })
    .map((p) => p.periodo);
}

/* ============================================================
   🔥 useMallasFiltradas
   ============================================================ */
export const useMallasFiltradas = (
  periodos: { ramos: { codigoRamo: string }[]; periodo?: string }[]
) => {
  const { mallas, loading: loadingMallas, error: errorMallas } = useMallas();
  const { avance, loading: loadingAvance, error: errorAvance } = useAvance();

  /* ============================================================
     🔥 1) Códigos no disponibles (APROBADO + INSCRITO)
     ============================================================ */
  const codigosNoDisponibles = useMemo(() => {
    return new Set(
      avance
        .filter(
          (a) => a.status === "APROBADO" || a.status === "INSCRITO"
        )
        .map((a) => a.course)
    );
  }, [avance]);

  /* ============================================================
     🔍 Mapa codigo → Malla
     ============================================================ */
  const mallaMap = useMemo(() => {
    const map = new Map<string, Malla>();
    for (const m of mallas || []) {
      map.set(m.codigo, m);
    }
    return map;
  }, [mallas]);

  /* ============================================================
     🔍 Historial: código → { estado, periodo }
     ============================================================ */
  const historialMap = useMemo(() => {
    const map = new Map<string, { estado: string; periodo: string }>();
    for (const a of avance) {
      map.set(a.course, {
        estado: a.status,
        periodo: a.period ?? "",
      });
    }
    return map;
  }, [avance]);

  const parsePrereq = (prereq: string) =>
    prereq
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  /* ============================================================
     🔥 Prerrequisitos (modo B)
     ============================================================ */
  const prereqsSatisfechos = (prereqStr: string, semestreActual: number) => {
    if (!prereqStr) return true;

    const prereqs = parsePrereq(prereqStr);
    if (prereqs.length === 0) return true;

    return prereqs.every((p) => {
      if (codigosNoDisponibles.has(p)) return true;

      const prereqMalla = mallaMap.get(p);
      if (!prereqMalla) return false;

      return prereqMalla.nivel <= semestreActual;
    });
  };

  /* ============================================================
     🔥 Construcción de opcionesPorPeriodo
     ============================================================ */
  const opcionesPorPeriodo: RamosPorNivel[][] = useMemo(() => {
    if (!mallas || mallas.length === 0) return [];

    const totalPeriodos = Math.max(1, periodos.length);
    const resultado: RamosPorNivel[][] = [];

    const ramosDisponibles = mallas.filter(
      (r) => !codigosNoDisponibles.has(r.codigo)
    );

    for (let i = 0; i < totalPeriodos; i++) {
      const semestreActual = i + 1;

      const permitidos = ramosDisponibles
        .filter((r) => prereqsSatisfechos(r.prereq ?? "", semestreActual))
        .map((r) => {
          const hist = historialMap.get(r.codigo);
          return hist
            ? {
                ...r,
                historial: {
                  estado: hist.estado,
                  periodo: hist.periodo,
                },
              }
            : r;
        });

      const mapaNivel = new Map<number, RamosPorNivel["ramos"]>();

      for (const ramo of permitidos) {
        if (!mapaNivel.has(ramo.nivel)) mapaNivel.set(ramo.nivel, []);
        mapaNivel.get(ramo.nivel)!.push(ramo);
      }

      const agrupado = Array.from(mapaNivel.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([nivel, ramos]) => ({
          nivel,
          ramos,
        }));

      resultado.push(agrupado);
    }

    return resultado;
  }, [mallas, codigosNoDisponibles, historialMap, mallaMap, periodos.length]);

  /* ============================================================
     🔥 PERIODO MÁS ANTIGUO Y MÁS RECIENTE (PROFESIONAL)
     Se toma desde el avance: es la fuente real de historia académica.
     ============================================================ */
  const periodosAvanceOrdenados = useMemo(() => {
    const lista = avance.map((a) => a.period).filter(Boolean);
    return ordenarPeriodos(lista);
  }, [avance]);

  const periodoMasAntiguo = periodosAvanceOrdenados[0] ?? null;
  const periodoMasReciente =
    periodosAvanceOrdenados[periodosAvanceOrdenados.length - 1] ?? null;

  return {
    opcionesPorPeriodo,
    periodoMasAntiguo,
    periodoMasReciente,
    loading: loadingMallas || loadingAvance,
    error: errorMallas || errorAvance,
  };
};
