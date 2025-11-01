"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { getProyeccionData, createProyeccion } from "../../services/proyeccionesService"
import type { ProyeccionData, ProyeccionRamo } from "../../types/proyeccion"

interface RamoEnProyeccion extends ProyeccionRamo {
  asignatura: string
  creditos: number
}

const parsePrerequisitos = (prereqString: string): string[] => {
  if (!prereqString || prereqString === "SIN REQUISITOS") return []

  // Remove parentheses and split by "Y" or "O"
  const cleaned = prereqString.replace(/[()]/g, "")
  const ramos = cleaned.split(/\s+(?:Y|O)\s+/)

  return ramos.map((r) => r.trim()).filter((r) => r.length > 0)
}

const CrearProyeccion = () => {
  const { codigo } = useParams<{ codigo: string }>()
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [proyeccionData, setProyeccionData] = useState<ProyeccionData | null>(null)

  const [nombreProyeccion, setNombreProyeccion] = useState("")
  const [ramosSeleccionados, setRamosSeleccionados] = useState<RamoEnProyeccion[]>([])
  const [semestreActual, setSemestreActual] = useState(1)
  const [guardando, setGuardando] = useState(false)

  const carrera = user?.carreras.find((c) => c.codigo === codigo)

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

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const verificarPrerequisitos = (
    codigoRamo: string,
    semestreDestino: number,
  ): { valido: boolean; mensaje: string } => {
    const ramoMalla = proyeccionData?.malla.find((r) => r.codigo === codigoRamo)
    if (!ramoMalla) return { valido: false, mensaje: "Ramo no encontrado en la malla" }

    const prerequisitos = parsePrerequisitos(ramoMalla.prereq)
    if (prerequisitos.length === 0) return { valido: true, mensaje: "" }

    // Check each prerequisite
    for (const prereq of prerequisitos) {
      // Check if already approved
      const yaAprobado = proyeccionData?.avance.some((a) => a.course === prereq && a.status === "APROBADO")

      if (yaAprobado) continue

      // Check if it's in the projection in a previous semester
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
    // Find courses that depend on this one
    const dependientes = ramosSeleccionados.filter((r) => {
      const ramoMalla = proyeccionData?.malla.find((m) => m.codigo === r.codigoRamo)
      if (!ramoMalla) return false

      const prereqs = parsePrerequisitos(ramoMalla.prereq)
      return prereqs.includes(codigoRamo)
    })

    // Check if any dependent course is in the same or earlier semester
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
        // Remove the course and all its dependents
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

    if (!token || !user) return

    try {
      setGuardando(true)
      await createProyeccion(token, {
        rut: user.rut,
        nombre: nombreProyeccion,
        codigoCarrera: codigo || "",
        ramos: ramosSeleccionados.map((r) => ({
          codigoRamo: r.codigoRamo,
          semestre: r.semestre,
        })),
      })
      alert("Proyección creada exitosamente")
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      alert("Error al crear la proyección")
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <Link to="/dashboard" className="font-bold text-xl">
            App Mallas UCN
          </Link>
          <button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded">
            Cerrar Sesión
          </button>
        </nav>
        <div className="p-8 text-center">
          <p className="text-lg">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (error || !proyeccionData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <Link to="/dashboard" className="font-bold text-xl">
            App Mallas UCN
          </Link>
          <button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded">
            Cerrar Sesión
          </button>
        </nav>
        <div className="p-8 text-center">
          <p className="text-red-600 text-lg">{error || "Error al cargar los datos"}</p>
          <Link to="/dashboard" className="text-blue-500 underline mt-4 inline-block">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const ramosAprobados = proyeccionData.avance.filter((a) => a.status === "APROBADO")
  const ramosReprobados = proyeccionData.avance.filter((a) => a.status === "REPROBADO")
  const creditosAprobados = ramosAprobados.reduce((sum, ramo) => {
    const ramoMalla = proyeccionData?.malla.find((m) => m.codigo === ramo.course)
    return sum + (ramoMalla?.creditos || 0)
  }, 0)
  const creditosTotales = proyeccionData.malla.reduce((sum, r) => sum + r.creditos, 0)

  const ramosPorSemestre = ramosSeleccionados.reduce(
    (acc, ramo) => {
      if (!acc[ramo.semestre]) acc[ramo.semestre] = []
      acc[ramo.semestre].push(ramo)
      return acc
    },
    {} as Record<number, RamoEnProyeccion[]>,
  )

  const maxSemestre = Math.max(...Object.keys(ramosPorSemestre).map(Number), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="font-bold text-xl">
            App Mallas UCN
          </Link>
          <div className="flex items-center gap-4">
            <Link to={`/malla/${codigo}`} className="hover:text-orange-400">
              Malla
            </Link>
            <Link to={`/avance/${codigo}`} className="hover:text-orange-400">
              Avance
            </Link>
            <Link to={`/crear-proyeccion/${codigo}`} className="text-orange-400 font-semibold">
              Crear Proyección
            </Link>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded">
          Cerrar Sesión
        </button>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Crear Proyección de Semestre</h1>
        <p className="text-gray-600 mb-6">{carrera?.nombre}</p>

        {/* Resumen de Avance */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Resumen de Avance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Ramos Aprobados</p>
              <p className="text-2xl font-bold text-green-700">{ramosAprobados.length}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-gray-600">Ramos Reprobados</p>
              <p className="text-2xl font-bold text-red-700">{ramosReprobados.length}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Créditos Aprobados</p>
              <p className="text-2xl font-bold text-blue-700">
                {creditosAprobados} / {creditosTotales}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Ramos Disponibles</p>
              <p className="text-2xl font-bold text-purple-700">{proyeccionData.ramosLiberados.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel Izquierdo: Configuración */}
          <div className="space-y-6">
            {/* Nombre de la Proyección */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Configuración de Proyección</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Proyección</label>
                <input
                  type="text"
                  value={nombreProyeccion}
                  onChange={(e) => setNombreProyeccion(e.target.value)}
                  placeholder="Ej: Proyección Semestre 2025-1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semestre para agregar ramos</label>
                <input
                  type="number"
                  min="1"
                  value={semestreActual}
                  onChange={(e) => setSemestreActual(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Ramos Disponibles */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Ramos Disponibles para Cursar</h2>
              <p className="text-sm text-gray-600 mb-4">Estos ramos tienen sus prerrequisitos cumplidos</p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {proyeccionData.ramosLiberados.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay ramos disponibles en este momento</p>
                ) : (
                  proyeccionData.ramosLiberados.map((ramo) => {
                    const yaAgregado = ramosSeleccionados.some((r) => r.codigoRamo === ramo.codigo)
                    const validacion = verificarPrerequisitos(ramo.codigo, semestreActual)
                    const puedeAgregar = !yaAgregado && validacion.valido

                    return (
                      <div
                        key={ramo.codigo}
                        className={`p-3 border rounded-lg ${
                          yaAgregado
                            ? "bg-gray-100 border-gray-300"
                            : puedeAgregar
                              ? "bg-white border-gray-200 hover:border-blue-400"
                              : "bg-yellow-50 border-yellow-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{ramo.codigo}</p>
                            <p className="text-xs text-gray-600">{ramo.asignatura}</p>
                            <p className="text-xs text-gray-500">
                              {ramo.creditos} créditos • Nivel {ramo.nivel}
                            </p>
                            {!yaAgregado && !validacion.valido && (
                              <p className="text-xs text-yellow-700 mt-1">⚠️ {validacion.mensaje}</p>
                            )}
                          </div>
                          <button
                            onClick={() => agregarRamo(ramo.codigo)}
                            disabled={yaAgregado || !puedeAgregar}
                            className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${
                              yaAgregado
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : puedeAgregar
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "bg-yellow-300 text-yellow-800 cursor-not-allowed"
                            }`}
                          >
                            {yaAgregado ? "Agregado" : puedeAgregar ? "Agregar" : "Bloqueado"}
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Panel Derecho: Proyección */}
          <div className="space-y-6">
            {/* Vista de Proyección por Semestre */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Proyección por Semestre</h2>
              {ramosSeleccionados.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Agrega ramos desde el panel izquierdo para comenzar tu proyección
                </p>
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: maxSemestre }, (_, i) => i + 1).map((semestre) => {
                    const ramosSemestre = ramosPorSemestre[semestre] || []
                    const creditosSemestre = ramosSemestre.reduce((sum, r) => sum + r.creditos, 0)

                    return (
                      <div key={semestre} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-lg">Semestre {semestre}</h3>
                          <span className="text-sm text-gray-600">{creditosSemestre} créditos</span>
                        </div>
                        {ramosSemestre.length === 0 ? (
                          <p className="text-gray-400 text-sm">Sin ramos asignados</p>
                        ) : (
                          <div className="space-y-2">
                            {ramosSemestre.map((ramo) => (
                              <div key={ramo.codigoRamo} className="bg-blue-50 p-3 rounded border border-blue-200">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm">{ramo.codigoRamo}</p>
                                    <p className="text-xs text-gray-600">{ramo.asignatura}</p>
                                    <p className="text-xs text-gray-500">{ramo.creditos} créditos</p>
                                  </div>
                                  <button
                                    onClick={() => eliminarRamo(ramo.codigoRamo)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <label className="text-xs text-gray-600">Mover a semestre:</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={ramo.semestre}
                                    onChange={(e) => cambiarSemestre(ramo.codigoRamo, Number(e.target.value))}
                                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex gap-4">
                <button
                  onClick={handleGuardarProyeccion}
                  disabled={guardando || ramosSeleccionados.length === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    guardando || ramosSeleccionados.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {guardando ? "Guardando..." : "Guardar Proyección"}
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CrearProyeccion
