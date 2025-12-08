import { useState, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext" // Asumo ruta
import { getProyeccionAutomatica } from "../../../api/services/proyeccionesService" // Asumo ruta

export const useProyeccionAutomatica = (codigoCarrera: string) => {
  const { token, user } = useAuth()
  const [proyeccion, setProyeccion] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || !user || !codigoCarrera) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const rut = user.rut
        // Asumimos que el catálogo está en la primera carrera del usuario, igual que en tu useMallas
        const catalogo = user.carreras[0].catalogo 

        const data = await getProyeccionAutomatica(token, rut, codigoCarrera, catalogo)
        setProyeccion(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Error al generar la proyección")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, user, codigoCarrera])

  return { proyeccion, loading, error }
}