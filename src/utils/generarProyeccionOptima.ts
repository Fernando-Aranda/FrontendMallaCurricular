import type { RamosPorNivel } from "../hooks/useMallasFiltradas";

export interface RamoOptimo {
  codigoRamo: string;
  semestre: number;
}

export interface PeriodoOptimo {
  catalogo: string;
  ramos: RamoOptimo[];
}

/**
 * generarProyeccionOptima
 *
 * Construye una proyección académica respetando prerrequisitos y máximo de créditos por periodo.
 *
 * @param opcionesPorPeriodo - ramos filtrados por periodo/nivel de useMallasFiltradas
 * @param maxCreditos - máximo de créditos por periodo
 * @param periodoInicio - string YYYYSS (ej: 202420)
 */
export function generarProyeccionOptima(
  opcionesPorPeriodo: RamosPorNivel[][],
  maxCreditos: number,
  periodoInicio: string
): PeriodoOptimo[] {
  const periodos: PeriodoOptimo[] = [];
  const ramosAgregados = new Set<string>();
  let periodoActual = periodoInicio;

  // función helper para calcular siguiente periodo
  const siguientePeriodo = (periodo: string) => {
    const year = Number(periodo.slice(0, 4));
    const sem = Number(periodo.slice(4, 6));
    if (sem === 10) return `${year}20`;
    if (sem === 20) return `${year + 1}10`;
    throw new Error("Periodo inválido");
  };

  for (let i = 0; i < opcionesPorPeriodo.length; i++) {
    const nivelRamos = opcionesPorPeriodo[i];
    const ramosPeriodo: RamoOptimo[] = [];
    let creditosAcumulados = 0;

    for (const grupo of nivelRamos) {
      for (const r of grupo.ramos) {
        // no repetir ramos
        if (ramosAgregados.has(r.codigo)) continue;
        // respetar prerrequisitos
        const prereqs = (r.prereq ?? "").split(",").map((s) => s.trim()).filter(Boolean);
        const prereqsPendientes = prereqs.some((p) => !ramosAgregados.has(p));
        if (prereqsPendientes) continue;

        // controlar créditos
        const creditosRamo = r.creditos ?? 0;
        if (creditosAcumulados + creditosRamo > maxCreditos) continue;

        ramosPeriodo.push({
          codigoRamo: r.codigo,
          semestre: i + 1,
        });
        ramosAgregados.add(r.codigo);
        creditosAcumulados += creditosRamo;
      }
    }

    periodos.push({
      catalogo: periodoActual,
      ramos: ramosPeriodo,
    });

    periodoActual = siguientePeriodo(periodoActual);
  }

  return periodos;
}
