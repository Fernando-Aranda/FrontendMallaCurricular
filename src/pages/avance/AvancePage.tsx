"use client"

import { useAvance } from "../../hooks/useAvance"
import { useMallas } from "../../hooks/useMallas"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import NavigationUcn from "../../components/NavigationUcn"

// 1. PALETA DE COLORES ESTANDARIZADA
const COLORS = {
  background: "#F9FAFB", // bg-gray-50
  primary: {
    dark: "#1E293B", // bg-slate-800
    main: "#3B82F6", // bg-blue-500
  },
  success: {
    light: "#F0FDF4", // bg-green-50, o bg-green-100
  },
  error: {
    light: "#FEF2F2", // bg-red-50, o bg-red-100
  },
  text: {
    primary: "#1F2937", // text-slate-800
    secondary: "#4B5563", // text-gray-600
  },
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

  // --- LÓGICA DE PROCESAMIENTO DE DATOS (SIN CAMBIOS) ---
  const asignaturaMap = useMemo(() => {
    if (!mallas.length) return new Map<string, { nombre: string; creditos: number; nivel: number }>()
    const map = new Map<string, { nombre: string; creditos: number; nivel: number }>()
    mallas.forEach((malla) => {
      map.set(malla.codigo, { nombre: malla.asignatura, creditos: malla.creditos, nivel: malla.nivel })
    })
    return map
  }, [mallas])

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
        if (item.status === "REPROBADO") existingCourse.failedCount++
        existingCourse.currentStatus = item.status
        existingCourse.latestPeriod = item.period
        existingCourse.latestNrc = item.nrc
      }
    })
    return courses
  }, [avance, asignaturaMap])

  const filteredCoursesBySemester = useMemo(() => {
    const grouped = new Map<number, GroupedCourse[]>()
    processedCourses.forEach((course) => {
      let shouldInclude = false
      if (filter === "TODOS") shouldInclude = true
      else if (filter === "REPROBADO") shouldInclude = course.failedCount > 0
      else shouldInclude = course.currentStatus === filter
      if (shouldInclude) {
        const courseInfo = asignaturaMap.get(course.courseCode)
        if (courseInfo) {
          const semester = courseInfo.nivel
          if (!grouped.has(semester)) grouped.set(semester, [])
          grouped.get(semester)!.push(course)
        }
      }
    })
    return grouped
  }, [processedCourses, filter, asignaturaMap])

  const { totalCreditos, creditosAprobados } = useMemo(() => {
    const total = mallas.reduce((sum, malla) => sum + malla.creditos, 0)
    const aprobados = Array.from(processedCourses.values())
      .filter((course) => course.currentStatus === "APROBADO")
      .reduce((sum, course) => sum + course.credits, 0)
    return { totalCreditos: total, creditosAprobados: aprobados }
  }, [mallas, processedCourses])

  const progressPercentage = totalCreditos > 0 ? Math.round((creditosAprobados / totalCreditos) * 100) : 0

  // 2. FUNCIÓN AUXILIAR PARA OBTENER CLASES DE ESTILO
  const getStatusClasses = (status: string): string => {
    switch (status) {
      case "APROBADO": return "bg-green-100 text-slate-800"
      case "INSCRITO": return "bg-slate-500 text-white"
      case "REPROBADO": return "bg-red-500 text-white"
      default: return "bg-slate-400 text-white"
    }
  }

  if (loadingAvance || loadingMallas) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn />
        <p className="p-8 text-center text-lg text-gray-600">Cargando datos de avance...</p>
      </div>
    )
  }

  if (errorAvance || errorMallas) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn />
        <p className="p-8 text-center text-lg text-red-600">{errorAvance || errorMallas}</p>
      </div>
    )
  }

  const sortedSemesters = Array.from(filteredCoursesBySemester.keys()).sort((a, b) => a - b)

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationUcn codigoCarrera={codigo} />

      <div className="flex">
        {/* Área Principal de Contenido */}
        <div className="flex-1 p-8 overflow-x-auto">
          <h1 className="text-3xl font-bold mb-6 text-slate-800">
            Mi Avance Curricular
          </h1>

          <div className="inline-flex gap-4 min-w-full pb-4">
            {sortedSemesters.map((semester) => {
              const courses = filteredCoursesBySemester.get(semester)
              return (
                <div key={semester} className="flex flex-col gap-3 min-w-[280px]">
                  <div className="p-4 rounded-t-lg text-center font-bold text-white bg-slate-800">
                    Semestre {semester}
                  </div>

                  {(courses || []).map((course) => (
                    <div
                      key={course.courseCode}
                      className={`p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg relative group ${getStatusClasses(course.currentStatus)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-sm">{course.courseCode}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded font-semibold ${
                            course.currentStatus === "REPROBADO" ? "bg-white text-red-600"
                            : course.currentStatus === "APROBADO" ? "bg-slate-800 text-white"
                            : "bg-slate-800 text-white"
                          }`}
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

        {/* Menú Lateral Derecho */}
        <div className="w-80 p-8 border-l border-gray-200 bg-white">
          <div className="sticky top-8">
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-slate-800">Filtros</h2>
              <div className="space-y-2">
                {(["TODOS", "APROBADO", "INSCRITO", "REPROBADO"] as FilterType[]).map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
                      filter === filterOption ? "bg-blue-500" : "bg-slate-500 hover:bg-slate-600"
                    }`}
                  >
                    {filterOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-slate-800">Progreso</h2>
              <div className="flex justify-center mb-4">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" strokeWidth="12" fill="none" className="stroke-green-100" />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - progressPercentage / 100)}`}
                      strokeLinecap="round"
                      className="stroke-blue-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800">{progressPercentage}%</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg text-center bg-slate-600">
                <p className="text-white text-sm mb-1">Créditos Aprobados</p>
                <p className="text-white text-2xl font-bold">
                  {creditosAprobados} / {totalCreditos}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg flex justify-between items-center bg-green-100">
                <span className="text-sm font-semibold text-green-800">Aprobados</span>
                <span className="text-lg font-bold text-green-800">
                  {Array.from(processedCourses.values()).filter((c) => c.currentStatus === "APROBADO").length}
                </span>
              </div>
              <div className="p-3 rounded-lg flex justify-between items-center bg-red-100">
                <span className="text-sm font-semibold text-red-800">Reprobados (Historial)</span>
                <span className="text-lg font-bold text-red-800">
                  {Array.from(processedCourses.values()).filter((c) => c.failedCount > 0).length}
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