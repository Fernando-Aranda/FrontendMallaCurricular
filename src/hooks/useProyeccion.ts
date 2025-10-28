import { useMemo } from "react";

export interface Asignatura {
  codigo: string;
  asignatura: string;
  creditos: number;
  nivel: number;
  prereq: string;
}

export interface Avance {
  course: string;
  status: string; // "APROBADO" | "INSCRITO" | "REPROBADO"
}

export interface Semestre {
  numero: number;
  ramos: Asignatura[];
  bloqueados: string[];
  pasado: boolean;
}

export const useProyeccion = (avance: Avance[], malla: Asignatura[]): Semestre[] => {
  return useMemo(() => {
    if (!malla || malla.length === 0) return [];

    const totalSemestres = Math.max(...malla.map(m => m.nivel));
    const aprobados = avance.filter(a => a.status === "APROBADO").map(a => a.course);
    const enCurso = avance.filter(a => a.status === "INSCRITO").map(a => a.course);

    const semestres: Semestre[] = [];

    for (let i = 1; i <= totalSemestres; i++) {
      const ramosNivel = malla.filter(m => m.nivel === i);
      const ramos: Asignatura[] = [];
      const bloqueados: string[] = [];

      ramosNivel.forEach(ramo => {
        if (aprobados.includes(ramo.codigo)) {
          ramos.push(ramo);
        } else {
          const prereqs = ramo.prereq ? ramo.prereq.split(",") : [];
          const cumple = prereqs.every(p => aprobados.includes(p));
          if (cumple) {
            ramos.push(ramo);
          } else {
            bloqueados.push(ramo.codigo);
          }
        }
      });

      const pasado = i < enCursoNivel(enCurso, malla);
      semestres.push({ numero: i, ramos, bloqueados, pasado });
    }

    return semestres;
  }, [avance, malla]);
};

const enCursoNivel = (ramosEnCurso: string[], malla: Asignatura[]) => {
  if (!ramosEnCurso.length) return 1;
  return Math.max(...ramosEnCurso.map(c => malla.find(r => r.codigo === c)?.nivel || 1));
};
