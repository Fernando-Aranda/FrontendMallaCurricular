import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"
import { getProyeccionData, createProyeccion } from "../../../api/services/proyeccionesService"
import type { ProyeccionData, ProyeccionRamo } from "../../../types/proyeccion"

export type RamoMalla = ProyeccionData['malla'][number]

export interface RamoEnProyeccion extends ProyeccionRamo {
  asignatura: string
  creditos: number
}
const parsePrerequisitos = (prereqString: string): string[] => {
  if (!prereqString || prereqString === "SIN REQUISITOS") return []
  const cleaned = prereqString.replace(/[()]/g, "")
  const ramos = cleaned.split(/\s+(?:Y|O)\s+/)
  return ramos.map((r) => r.trim()).filter((r) => r.length > 0)
}

export const useCrearProyeccion = () => {
  const { codigo } = useParams<{ codigo: string }>()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  // --- ESTADOS ---
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [proyeccionData, setProyeccionData] = useState<ProyeccionData | null>(null)
  const [nombreProyeccion, setNombreProyeccion] = useState("")
  const [ramosSeleccionados, setRamosSeleccionados] = useState<RamoEnProyeccion[]>([])
  const [semestreActual, setSemestreActual] = useState(1)
  const [guardando, setGuardando] = useState(false)

  // --- DATOS DERIVADOS ---
  const carrera = useMemo(() => user?.carreras.find((c) => c.codigo === codigo), [user, codigo])

  // --- EFECTOS ---
  useEffect(() => {
    if (!token || !user || !codigo || !carrera) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await getProyeccionData(token, user.rut, codigo, carrera.catalogo)
        setProyeccionData(data)
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Error al cargar los datos de proyección")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, user, codigo, carrera])

  // --- LÓGICA DE NEGOCIO Y VALIDACIONES ---
  const verificarPrerequisitos = (
    codigoRamo: string,
    semestreDestino: number,
  ): { valido: boolean; mensaje: string } => {
    const ramoMalla = proyeccionData?.malla.find((r) => r.codigo === codigoRamo)
    if (!ramoMalla) return { valido: false, mensaje: "Ramo no encontrado en la malla" }

    const prerequisitos = parsePrerequisitos(ramoMalla.prereq)
    if (prerequisitos.length === 0) return { valido: true, mensaje: "" }

    for (const prereq of prerequisitos) {
      const yaAprobado = proyeccionData?.avance.some((a) => a.course === prereq && a.status === "APROBADO")
      if (yaAprobado) continue

      const enProyeccion = ramosSeleccionados.find((r) => r.codigoRamo === prereq)
      if (!enProyeccion) {
        const prereqInfo = proyeccionData?.malla.find((r) => r.codigo === prereq)
        return {
          valido: false,
          mensaje: `Falta el prerrequisito: ${prereq} - ${prereqInfo?.asignatura || ""}`,
        }
      }

      if (enProyeccion.semestre >= semestreDestino) {
        const prereqInfo = proyeccionData?.malla.find((r) => r.codigo === prereq)
        return {
          valido: false,
          mensaje: `El prerrequisito ${prereq} - ${prereqInfo?.asignatura || ""} debe estar en un semestre anterior (actualmente en semestre ${enProyeccion.semestre})`,
        }
      }
    }
    return { valido: true, mensaje: "" }
  }

  const verificarDependencias = (codigoRamo: string, nuevoSemestre: number): { valido: boolean; mensaje: string } => {
    const dependientes = ramosSeleccionados.filter((r) => {
      const ramoMalla = proyeccionData?.malla.find((m) => m.codigo === r.codigoRamo)
      if (!ramoMalla) return false
      const prereqs = parsePrerequisitos(ramoMalla.prereq)
      return prereqs.includes(codigoRamo)
    })

    for (const dep of dependientes) {
      if (dep.semestre <= nuevoSemestre) {
        return {
          valido: false,
          mensaje: `No se puede mover porque ${dep.codigoRamo} - ${dep.asignatura} (semestre ${dep.semestre}) depende de este ramo`,
        }
      }
    }
    return { valido: true, mensaje: "" }
  }

  // --- MANEJADORES DE EVENTOS ---
  const agregarRamo = (codigoRamo: string) => {
    const ramo = proyeccionData?.ramosLiberados.find((r) => r.codigo === codigoRamo)
    if (!ramo) return

    const yaAgregado = ramosSeleccionados.some((r) => r.codigoRamo === codigoRamo)
    if (yaAgregado) {
      alert("Este ramo ya está en la proyección")
      return
    }

    const validacion = verificarPrerequisitos(codigoRamo, semestreActual)
    if (!validacion.valido) {
      alert(`No se puede agregar el ramo:\n${validacion.mensaje}`)
      return
    }

    setRamosSeleccionados([
      ...ramosSeleccionados,
      {
        codigoRamo: ramo.codigo,
        semestre: semestreActual,
        asignatura: ramo.asignatura,
        creditos: ramo.creditos,
      },
    ])
  }

  const eliminarRamo = (codigoRamo: string) => {
    const dependientes = ramosSeleccionados.filter((r) => {
      const ramoMalla = proyeccionData?.malla.find((m) => m.codigo === r.codigoRamo)
      if (!ramoMalla) return false
      const prereqs = parsePrerequisitos(ramoMalla.prereq)
      return prereqs.includes(codigoRamo)
    })

    if (dependientes.length > 0) {
      const listaDependientes = dependientes.map((d) => `${d.codigoRamo} - ${d.asignatura}`).join("\n")
      const confirmar = window.confirm(
        `Los siguientes ramos dependen de este:\n${listaDependientes}\n\n¿Deseas eliminarlos también?`,
      )
      if (confirmar) {
        const codigosAEliminar = [codigoRamo, ...dependientes.map((d) => d.codigoRamo)]
        setRamosSeleccionados(ramosSeleccionados.filter((r) => !codigosAEliminar.includes(r.codigoRamo)))
      }
      return
    }
    setRamosSeleccionados(ramosSeleccionados.filter((r) => r.codigoRamo !== codigoRamo))
  }

  const cambiarSemestre = (codigoRamo: string, nuevoSemestre: number) => {
    if (nuevoSemestre < 1) {
      alert("El semestre debe ser mayor a 0")
      return
    }
    const validacionPrereq = verificarPrerequisitos(codigoRamo, nuevoSemestre)
    if (!validacionPrereq.valido) {
      alert(`No se puede mover el ramo:\n${validacionPrereq.mensaje}`)
      return
    }
    const validacionDep = verificarDependencias(codigoRamo, nuevoSemestre)
    if (!validacionDep.valido) {
      alert(`No se puede mover el ramo:\n${validacionDep.mensaje}`)
      return
    }
    setRamosSeleccionados(
      ramosSeleccionados.map((r) => (r.codigoRamo === codigoRamo ? { ...r, semestre: nuevoSemestre } : r)),
    )
  }

  const handleGuardarProyeccion = async () => {
    if (!nombreProyeccion.trim()) {
      alert("Por favor ingresa un nombre para la proyección")
      return
    }
    if (ramosSeleccionados.length === 0) {
      alert("Debes agregar al menos un ramo a la proyección")
      return
    }
    if (!token || !user || !codigo) return

    try {
      setGuardando(true)
      await createProyeccion(token, {
        rut: user.rut,
        nombre: nombreProyeccion,
        codigoCarrera: codigo,
        ramos: ramosSeleccionados.map((r) => ({
          codigoRamo: r.codigoRamo,
          semestre: r.semestre,
        })),
      })
      alert("Proyección creada exitosamente")
      navigate("/home")
    } catch (err) {
      console.error(err)
      alert("Error al crear la proyección")
    } finally {
      setGuardando(false)
    }
  }

  // --- CÁLCULOS PARA LA UI ---
  const ramosPorSemestre = useMemo(
    () =>
      ramosSeleccionados.reduce(
        (acc, ramo) => {
          if (!acc[ramo.semestre]) acc[ramo.semestre] = []
          acc[ramo.semestre].push(ramo)
          return acc
        },
        {} as Record<number, RamoEnProyeccion[]>,
      ),
    [ramosSeleccionados],
  )
  const maxSemestre = useMemo(() => Math.max(...Object.keys(ramosPorSemestre).map(Number), 0), [ramosPorSemestre])

  return {
    // Estados y datos
    loading,
    error,
    proyeccionData,
    codigo,
    carrera,
    nombreProyeccion,
    semestreActual,
    ramosSeleccionados,
    guardando,
    ramosPorSemestre,
    maxSemestre,
    // Funciones y manejadores
    setNombreProyeccion,
    setSemestreActual,
    verificarPrerequisitos,
    agregarRamo,
    eliminarRamo,
    cambiarSemestre,
    handleGuardarProyeccion,
    navigate,
  }
}