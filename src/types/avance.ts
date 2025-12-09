// src/types/avance.ts

// Esta interfaz ahora representa exactamente un objeto del array que devuelve tu API.
export interface Avance {
  nrc: string;
  period: string;      // Ej: "202320" (año y semestre)
  student: string;     // El RUT del estudiante
  course: string;      // El código de la asignatura. Ej: "ECIN-00416"
  excluded: boolean;
  inscriptionType: string;
  status: 'APROBADO' | 'REPROBADO' | string; // Usamos 'string' como respaldo por si hay otros estados
}