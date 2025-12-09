import { useState, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext" 
import { getProyeccionAutomatica } from "../../../api/services/proyeccionesService" 

export const useProyeccionAutomatica = (codigoCarrera: string) => {
  const { token, user } = useAuth()
  const [proyeccion, setProyeccion] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Validar datos mínimos
    if (!token || !user || !codigoCarrera) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const rut = user.rut
        
        // 1. BUSCAR CARRERA CORRECTA (Core Fix)
        // Buscamos en el array de carreras la que coincida con el código de la URL
        // Convertimos a String para evitar errores de tipo (number vs string)
        const carreraActual = user.carreras.find(c => String(c.codigo) === String(codigoCarrera))

        if (!carreraActual) {
            setError(`No tienes acceso a la carrera ${codigoCarrera}`)
            setLoading(false)
            return
        }

        // 2. EXTRAER CATÁLOGO CORRECTO
        const catalogo = carreraActual.catalogo 

        console.log(`Generando proyección para ${codigoCarrera} (Catálogo: ${catalogo})...`)
        
        // 3. LLAMAR API
        const data = await getProyeccionAutomatica(token, rut, codigoCarrera, catalogo)
        
        // Asignar respuesta (manejando posible estructura anidada)
        const semestres = data.semestres || data || [];
        setProyeccion(semestres)
        
        if (semestres.length === 0) {
            console.warn("La API devolvió 0 semestres. Verificar backend o estado del alumno.")
        }
        
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