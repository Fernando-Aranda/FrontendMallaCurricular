// Tipos para las proyecciones
export interface ProyeccionRamo {
  codigoRamo: string;
  semestre: number;
}

export interface ProyeccionAlerta {
  id: number;
  descripcion: string;
  tipo?: string; // opcional, por si en el futuro agregas severidad o tipo de alerta
}

export interface CreateProyeccionDto {
  rut: string;
  nombre: string;
  codigoCarrera: string;
  ramos: ProyeccionRamo[];
}

export interface Proyeccion {
  id: number;
  rut: string;
  nombre: string;
  codigoCarrera: string;
  fechaCreacion: string | Date; // puede venir como string del backend
  ramos: ProyeccionRamo[];
  alertas?: ProyeccionAlerta[]; // 👈 agregado
}

// Tipos para los datos de proyección
export interface ProyeccionData {
  malla: Array<{
    codigo: string;
    asignatura: string;
    creditos: number;
    nivel: number;
    prereq: string;
  }>;
  avance: Array<{
    nrc: string;
    period: string;
    student: string;
    course: string;
    excluded: boolean;
    inscriptionType: string;
    status: "APROBADO" | "REPROBADO" | string;
  }>;
  ramosLiberados: Array<{
    codigo: string;
    asignatura: string;
    creditos: number;
    nivel: number;
    prereq: string;
  }>;
}
