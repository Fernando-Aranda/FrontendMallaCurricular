import { useMemo } from "react";
import { useParams } from "react-router-dom";
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
  
  const { mallas, loading: loadingMallas, error: errorMallas } = useMallas(codigoCarrera);

  const { avance, loading: loadingAvance, error: errorAvance } = useAvance();

  const historialMap = useMemo(() => {
    const map = new Map<string, { estado: string; periodo: string }[]>();

    if (!avance) return map; 

    for (const item of avance) {
      if (!map.has(item.course)) map.set(item.course, []);
      map.get(item.course)!.push({ estado: item.status, periodo: item.period });
    }
    return map;
  }, [avance]);


  const nivelesAgrupados: RamosPorNivel[] = useMemo(() => {
    if (!mallas || mallas.length === 0) return [];

    const mapa = new Map<number, RamosPorNivel["ramos"]>();
    for (const r of mallas) {
      if (!mapa.has(r.nivel)) mapa.set(r.nivel, []);

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