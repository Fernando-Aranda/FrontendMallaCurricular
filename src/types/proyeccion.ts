export interface Proyeccion {
  id: number;
  nombre: string;
  rut: string;
  codigoCarrera: string;
  periodos: PeriodoProyeccion[];
}

export interface PeriodoProyeccion {
  catalogo: string;
  ramos: RamoProyeccion[];
}

export interface RamoProyeccion {
  codigoRamo: string;
  semestre: number;
}
