// src/hooks/useProyeccion.ts
import { useMemo } from "react";
import type { Avance } from "../types/avance";
import type { Malla } from "../types/mallas";

export interface Semestre {
  numero: number;
  ramos: string[]; // códigos de asignaturas
  bloqueados: string[]; // ramos que no se pueden poner por prerrequisitos
  pasado: boolean; // indica si es semestre ya cursado
}

export const useProyeccion = (avance: Avance[], mallas: Malla[]) => {
  return useMemo(() => {
    const totalSemestres = Math.max(...mallas.map(m => m.nivel));
    const semestres: Semestre[] = [];

    const cursados = avance.filter(a => a.status === "APROBADO").map(a => a.course);
    const enCurso = avance.filter(a => a.status === "EN CURSO").map(a => a.course);

    for (let i = 1; i <= totalSemestres; i++) {
      let ramos: string[] = [];
      let pasado = false;

      if (i < enCursoNivel(enCurso, mallas)) {
        // Semestres ya pasados
        ramos = cursados.filter(c => getNivel(c, mallas) === i);
        pasado = true;
      } else if (i === enCursoNivel(enCurso, mallas)) {
        // Semestre actual
        ramos = enCurso;
        pasado = false;
      } else {
        ramos = [];
        pasado = false;
      }

      const bloqueados = calcularBloqueados(ramos, semestres, mallas);

      semestres.push({ numero: i, ramos, bloqueados, pasado });
    }

    return semestres;
  }, [avance, mallas]);
};

// Función auxiliar para obtener el nivel de los ramos en curso
const enCursoNivel = (ramosEnCurso: string[], mallas: Malla[]) => {
  if (!ramosEnCurso.length) return 1;
  return Math.max(...ramosEnCurso.map(r => getNivel(r, mallas)));
};

const getNivel = (codigo: string, mallas: Malla[]) => {
  return mallas.find(m => m.codigo === codigo)?.nivel || 1;
};

// Calcula qué ramos quedan bloqueados por prerrequisito
const calcularBloqueados = (ramos: string[], semestres: any[], mallas: Malla[]): string[] => {
  const aprobados = semestres.flatMap(s => s.ramos);
  const bloqueados: string[] = [];

  mallas.forEach(m => {
    if (m.prereq && !aprobados.includes(m.prereq)) {
      bloqueados.push(m.codigo);
    }
  });

  return bloqueados;
};
