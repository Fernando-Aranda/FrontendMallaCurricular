export interface RamoInput {
  codigoRamo: string;
  semestre: number;
}

export interface PeriodoInput {
  catalogo: string;
  ramos: RamoInput[];
}

export interface CrearProyeccionInput {
  rut: string;
  nombre: string;
  codigoCarrera: string;
  periodos: PeriodoInput[];
}

export interface Proyeccion {
  id: number;
  nombre: string;
  rut: string;
  codigoCarrera: string;
  periodos: PeriodoInput[];
}
