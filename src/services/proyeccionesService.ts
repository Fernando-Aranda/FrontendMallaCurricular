import type { CreateProyeccionDto, Proyeccion, ProyeccionData } from "../types/proyeccion"

const API_URL = "http://localhost:3000"

export const getProyeccionData = async (
  token: string,
  rut: string,
  codCarrera: string,
  catalogo: string,
): Promise<ProyeccionData> => {
  const response = await fetch(`${API_URL}/estudiantes/proyeccion-data/${rut}/${codCarrera}/${catalogo}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Error al obtener los datos de proyección")
  }

  return response.json()
}

export const createProyeccion = async (token: string, proyeccion: CreateProyeccionDto): Promise<Proyeccion> => {
  const response = await fetch(`${API_URL}/proyecciones/createProyeccion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(proyeccion),
  })

  if (!response.ok) {
    throw new Error("Error al crear la proyección")
  }

  return response.json()
}

export const getProyeccionesByRut = async (token: string, rut: string): Promise<Proyeccion[]> => {
  const response = await fetch(`${API_URL}/proyecciones/usuario/${rut}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Error al obtener las proyecciones")
  }

  return response.json()
}
