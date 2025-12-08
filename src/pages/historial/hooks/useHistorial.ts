import { useEffect, useState } from "react"
import axios from "axios"
import { useAuth } from "../../../context/AuthContext"

export const useHistorial = (codigoCarrera?: string) => {
  const { user, token } = useAuth()
  const [historial, setHistorial] = useState<Record<string, any[]> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !token || !codigoCarrera) return

    const fetchHistorial = async () => {
      try {
        setLoading(true)
        setError(null)

        const rut = user.rut
        // Asegúrate de que esta URL sea la correcta para tu backend
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000"

        const carrera = user.carreras.find(c => c.codigo === codigoCarrera)
        const catalogo = carrera?.catalogo

        if (!catalogo) {
          setError("No se encontró el catálogo de la carrera.")
          setLoading(false)
          return
        }

        const res = await axios.get<Record<string, any[]>>(
          `${apiUrl}/estudiantes/historial/${rut}/${codigoCarrera}/${catalogo}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setHistorial(res.data)
      } catch (err: any) {
        console.error("Error al obtener historial:", err)
        setError("Error al cargar el historial académico.")
      } finally {
        setLoading(false)
      }
    }

    fetchHistorial()
  }, [user, token, codigoCarrera])

  return { historial, loading, error }
}