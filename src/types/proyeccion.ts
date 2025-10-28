// Tipos para las proyecciones
export interface ProyeccionRamo {
  codigoRamo: string
  semestre: number
}

export interface CreateProyeccionDto {
  rut: string
  nombre: string
  ramos: ProyeccionRamo[]
}

export interface Proyeccion {
  id: number
  rut: string
  nombre: string
  fechaCreacion: Date
  ramos: ProyeccionRamo[]
}

// Tipos para los datos de proyección
export interface ProyeccionData {
  malla: Array<{
    codigo: string
    asignatura: string
    creditos: number
    nivel: number
    prereq: string
  }>
  avance: Array<{
    nrc: string
    period: string
    student: string
    course: string
    excluded: boolean
    inscriptionType: string
    status: "APROBADO" | "REPROBADO" | string
  }>
  ramosLiberados: Array<{
    codigo: string
    asignatura: string
    creditos: number
    nivel: number
    prereq: string
  }>
}
