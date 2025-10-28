"use client"

import { useAvance } from "../../hooks/useAvance"
import { useMallas } from "../../hooks/useMallas"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import Navigation from "../../components/Navigation"

// Color palette
const COLORS = {
  darkPurple: "#32292F",
  mediumPurple: "#575366",
  blueGray: "#6E7DAB",
  brightBlue: "#5762D5",
  lightMint: "#D1E3DD",
}

type FilterType = "TODOS" | "APROBADO" | "REPROBADO" | "INSCRITO"

type GroupedCourse = {
  courseCode: string
  courseName: string
  credits: number
  currentStatus: string
  failedCount: number
  latestPeriod: string
  latestNrc: string
}

const AvancePage = () => {
  const { codigo } = useParams<{ codigo: string }>()
  const { avance, loading: loadingAvance, error: errorAvance } = useAvance()
  const { mallas, loading: loadingMallas, error: errorMallas } = useMallas()
  const [filter, setFilter] = useState<FilterType>("TODOS")

  const asignaturaMap = useMemo(() => {
    if (!mallas.length) return new Map<string, { nombre: string; creditos: number; nivel: number }>()

    const map = new Map<string, { nombre: string; creditos: number; nivel: number }>()
    mallas.forEach((malla) => {
      map.set(malla.codigo, { nombre: malla.asignatura, creditos: malla.creditos, nivel: malla.nivel })
    })
    return map
  }, [mallas])

  // <-- PASO 1: Procesamos TODOS los cursos para obtener su estado final y contador de reprobaciones. -->
  // Esta es nuestra fuente de datos principal y se calcula una sola vez.
  const processedCourses = useMemo(() => {
    const courses = new Map<string, GroupedCourse>()
    const sortedAvance = [...avance].sort((a, b) => a.period.localeCompare(b.period))

    sortedAvance.forEach((item) => {
      const courseInfo = asignaturaMap.get(item.course)
      if (!courseInfo) return

      if (!courses.has(item.course)) {
        courses.set(item.course, {
          courseCode: item.course,
          courseName: courseInfo.nombre,
          credits: courseInfo.creditos,
          currentStatus: item.status,
          failedCount: item.status === "REPROBADO" ? 1 : 0,
          latestPeriod: item.period,
          latestNrc: item.nrc,
        })
      } else {
        const existingCourse = courses.get(item.course)!
        if (item.status === "REPROBADO") {
          existingCourse.failedCount++
        }
        existingCourse.currentStatus = item.status
        existingCourse.latestPeriod = item.period
        existingCourse.latestNrc = item.nrc
      }
    })
    return courses
  }, [avance, asignaturaMap])

  // <-- PASO 2: Filtramos y agrupamos los cursos para la vista según el filtro seleccionado. -->
  const filteredCoursesBySemester = useMemo(() => {
    const grouped = new Map<number, GroupedCourse[]>()

    processedCourses.forEach((course) => {
      let shouldInclude = false

      // --- LÓGICA DE FILTRADO CORREGIDA ---
      if (filter === "TODOS") {
        shouldInclude = true
      } else if (filter === "REPROBADO") {
        // La condición clave: mostrar si el contador de reprobados es mayor a 0.
        shouldInclude = course.failedCount > 0
      } else {
        // Para 'APROBADO' e 'INSCRITO', comparamos el estado actual.
        shouldInclude = course.currentStatus === filter
      }

      if (shouldInclude) {
        const courseInfo = asignaturaMap.get(course.courseCode)
        if (courseInfo) {
          const semester = courseInfo.nivel
          if (!grouped.has(semester)) {
            grouped.set(semester, [])
          }
          grouped.get(semester)!.push(course)
        }
      }
    })

    return grouped
  }, [processedCourses, filter, asignaturaMap])

  // Cálculo de créditos (sin cambios, pero usa processedCourses para mayor precisión)
  const { totalCreditos, creditosAprobados } = useMemo(() => {
    const total = mallas.reduce((sum, malla) => sum + malla.creditos, 0)
    const aprobados = Array.from(processedCourses.values())
      .filter((course) => course.currentStatus === "APROBADO")
      .reduce((sum, course) => sum + course.credits, 0)
    return { totalCreditos: total, creditosAprobados: aprobados }
  }, [mallas, processedCourses])

  const progressPercentage = totalCreditos > 0 ? Math.round((creditosAprobados / totalCreditos) * 100) : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APROBADO": return COLORS.lightMint
      case "INSCRITO": return COLORS.blueGray
      case "REPROBADO": return "#ef4444"
      default: return COLORS.mediumPurple
    }
  }

  if (loadingAvance || loadingMallas) return <p className="p-8">Cargando datos...</p>
  if (errorAvance) return <p className="p-8 text-red-600">{errorAvance}</p>
  if (errorMallas) return <p className="p-8 text-red-600">{errorMallas}</p>

  const sortedSemesters = Array.from(filteredCoursesBySemester.keys()).sort((a, b) => a - b)

  return (
    <div className="min-h-screen bg-white">
      <Navigation carreraId={codigo || ""} />

      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-x-auto">
          <h1 className="text-3xl font-bold mb-6" style={{ color: COLORS.darkPurple }}>
            Mi Avance Curricular
          </h1>

          <div className="inline-flex gap-4 min-w-full">
            {sortedSemesters.map((semester) => {
              const courses = filteredCoursesBySemester.get(semester)
              return (
                <div key={semester} className="flex flex-col gap-3 min-w-[280px]">
                  <div className="p-4 rounded-lg text-center font-bold text-white" style={{ backgroundColor: COLORS.darkPurple }}>
                    Semestre {semester}
                  </div>

                  {(courses || []).map((course) => (
                    <div
                      key={course.courseCode}
                      className="p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg relative group"
                      style={{
                        backgroundColor: getStatusColor(course.currentStatus),
                        color: course.currentStatus === "APROBADO" ? COLORS.darkPurple : "white",
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-sm">{course.courseCode}</h3>
                        <span
                          className="text-xs px-2 py-1 rounded font-semibold"
                          style={{
                            backgroundColor:
                              course.currentStatus === "REPROBADO" ? "white" : COLORS.darkPurple,
                            color:
                              course.currentStatus === "REPROBADO" ? "#dc2626" : "white",
                          }}
                        >
                          {course.currentStatus}
                        </span>
                      </div>

                      <p className="text-sm mb-2 font-medium">{course.courseName}</p>

                      {course.failedCount > 0 && (
                        <p className="text-xs mb-2 font-semibold opacity-90">
                          Veces reprobado: {course.failedCount}
                        </p>
                      )}

                      <div className="flex justify-between items-center text-xs opacity-80">
                        <span>Periodo: {course.latestPeriod}</span>
                        <span>{course.credits} créditos</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {sortedSemesters.length === 0 && (
            <p className="text-center text-gray-500 mt-8">No hay cursos que coincidan con el filtro seleccionado.</p>
          )}
        </div>

        {/* --- MENÚ DE LA DERECHA RESTAURADO --- */}
        <div className="w-80 p-8 border-l border-gray-200 bg-gray-50">
          <div className="sticky top-8">
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: COLORS.darkPurple }}>
                Filtros
              </h2>
              <div className="space-y-2">
                {(["TODOS", "APROBADO", "INSCRITO", "REPROBADO"] as FilterType[]).map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className="w-full px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                    style={{
                      backgroundColor: filter === filterOption ? COLORS.brightBlue : COLORS.blueGray,
                      color: "white",
                    }}
                  >
                    {filterOption === "TODOS" ? "TODOS" : filterOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: COLORS.darkPurple }}>
                Progreso
              </h2>
              <div className="flex justify-center mb-4">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke={COLORS.lightMint} strokeWidth="12" fill="none" />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={COLORS.brightBlue}
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - progressPercentage / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color: COLORS.darkPurple }}>
                      {progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: COLORS.blueGray }}>
                <p className="text-white text-sm mb-1">Créditos Aprobados</p>
                <p className="text-white text-2xl font-bold">
                  {creditosAprobados} / {totalCreditos}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: COLORS.lightMint }}>
                <span className="text-sm font-semibold" style={{ color: COLORS.darkPurple }}>Aprobados</span>
                <span className="text-lg font-bold" style={{ color: COLORS.darkPurple }}>
                  {Array.from(processedCourses.values()).filter(c => c.currentStatus === 'APROBADO').length}
                </span>
              </div>
              <div className="p-3 rounded-lg flex justify-between items-center" style={{ backgroundColor: "#fee2e2" }}>
                <span className="text-sm font-semibold text-red-800">Reprobados (Historial)</span>
                <span className="text-lg font-bold text-red-800">
                  {Array.from(processedCourses.values()).filter(c => c.failedCount > 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AvancePage