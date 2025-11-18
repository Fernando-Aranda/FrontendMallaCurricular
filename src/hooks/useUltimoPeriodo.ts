import { useMemo } from "react";

export function useUltimoPeriodo(avance: any[]) {
  return useMemo(() => {
    if (!avance || avance.length === 0) return null;

    // Extraer todos los periodos válidos
    const periodos = avance
      .map(a => a.period)
      .filter(p => typeof p === "string");

    if (periodos.length === 0) return null;

    // Ordenar y tomar el mayor
    const ultimo = periodos.sort((a, b) => Number(b) - Number(a))[0];

    return ultimo;
  }, [avance]);
}
