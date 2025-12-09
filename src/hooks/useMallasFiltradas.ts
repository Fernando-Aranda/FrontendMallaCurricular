import { useMemo } from "react";
import { useParams } from "react-router-dom"; // 👈 Importamos
import { useMallas } from "./useMallas";
import { useAvance } from "./useAvance";
import type { Malla } from "../types/mallas";

export interface RamosPorNivel {
  nivel: number;
  ramos: (Malla & {
    historial: { estado: string; periodo: string }[];
  })[];
}

export const useMallasFiltradas = () => {
  const { codigoCarrera } = useParams<{ codigoCarrera: string }>();
  
  // 🔹 Pasamos el código explícitamente (aunque useMallas ya lo lee de useParams, es más seguro así)
  const { mallas, loading: loadingMallas, error: errorMallas } = useMallas(codigoCarrera);
  
  // Asumimos que useAvance trae todo el historial o filtra internamente.
  // Si useAvance soporta filtrar por carrera, deberías pasárselo también: useAvance(codigoCarrera)
  const { avance, loading: loadingAvance, error: errorAvance } = useAvance();

  // 🔹 Map de historial: course → [{ estado, periodo }]
  const historialMap = useMemo(() => {
    const map = new Map<string, { estado: string; periodo: string }[]>();
    // Protección por si avance es null/undefined
    if (!avance) return map; 

    for (const item of avance) {
      if (!map.has(item.course)) map.set(item.course, []);
      map.get(item.course)!.push({ estado: item.status, periodo: item.period });
    }
    return map;
  }, [avance]);

  // 🔹 Agrupar ramos por nivel
  const nivelesAgrupados: RamosPorNivel[] = useMemo(() => {
    if (!mallas || mallas.length === 0) return [];

    const mapa = new Map<number, RamosPorNivel["ramos"]>();
    for (const r of mallas) {
      if (!mapa.has(r.nivel)) mapa.set(r.nivel, []);
      
      // Aquí cruzamos la Malla Correcta (ICI) con el Historial (Global)
      // Solo se pintarán los ramos que existan en la malla 'mallas' (la de ICI)
      mapa.get(r.nivel)!.push({
        ...r,
        historial: historialMap.get(r.codigo) ?? [],
      });
    }

    return Array.from(mapa.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([nivel, ramos]) => ({ nivel, ramos }));
  }, [mallas, historialMap]);

  const opcionesPorPeriodo: RamosPorNivel[][] = useMemo(() => [nivelesAgrupados], [nivelesAgrupados]);

  const { periodoMasAntiguo, periodoMasReciente } = useMemo(() => {
    if (!avance || avance.length === 0) return { periodoMasAntiguo: null, periodoMasReciente: null };

    const periodos = avance
      .map((a) => a.period)
      .filter(Boolean)
      .sort();

    return {
      periodoMasAntiguo: periodos[0],
      periodoMasReciente: periodos[periodos.length - 1],
    };
  }, [avance]);

  return {
    opcionesPorPeriodo,
    loading: loadingMallas || loadingAvance,
    error: errorMallas || errorAvance,
    periodoMasAntiguo,
    periodoMasReciente,
  };
};