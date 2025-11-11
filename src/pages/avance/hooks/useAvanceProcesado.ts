import { useMemo } from "react"
import type { Malla } from "../../../types/mallas"

type GroupedCourse = {
  courseCode: string
  courseName: string
  credits: number
  currentStatus: string
  failedCount: number
  latestPeriod: string
  latestNrc: string
}

export const useAvanceProcesado = (avance: any[], mallas: Malla[], filter: string) => {
  // Mapa de asignaturas
  const asignaturaMap = useMemo(() => {
    const map = new Map<string, { nombre: string; creditos: number; nivel: number }>()
    mallas.forEach((malla) => {
      map.set(malla.codigo, {
        nombre: malla.asignatura,
        creditos: malla.creditos,
        nivel: malla.nivel,
      })
    })
    return map
  }, [mallas])

  // Procesar avance (agrupar por curso)
  const processedCourses = useMemo(() => {
    const courses = new Map<string, GroupedCourse>()
    const sortedAvance = [...avance].sort((a, b) => a.period.localeCompare(b.period))
    sortedAvance.forEach((item) => {
      const info = asignaturaMap.get(item.course)
      if (!info) return
      if (!courses.has(item.course)) {
        courses.set(item.course, {
          courseCode: item.course,
          courseName: info.nombre,
          credits: info.creditos,
          currentStatus: item.status,
          failedCount: item.status === "REPROBADO" ? 1 : 0,
          latestPeriod: item.period,
          latestNrc: item.nrc,
        })
      } else {
        const existing = courses.get(item.course)!
        if (item.status === "REPROBADO") existing.failedCount++
        existing.currentStatus = item.status
        existing.latestPeriod = item.period
        existing.latestNrc = item.nrc
      }
    })
    return courses
  }, [avance, asignaturaMap])

  // Filtrar y agrupar por semestre
  const filteredCoursesBySemester = useMemo(() => {
    const grouped = new Map<number, GroupedCourse[]>()
    processedCourses.forEach((course) => {
      const include =
        filter === "TODOS"
          ? true
          : filter === "REPROBADO"
          ? course.failedCount > 0
          : course.currentStatus === filter
      if (!include) return
      const info = asignaturaMap.get(course.courseCode)
      if (!info) return
      if (!grouped.has(info.nivel)) grouped.set(info.nivel, [])
      grouped.get(info.nivel)!.push(course)
    })
    return grouped
  }, [processedCourses, filter, asignaturaMap])

  // Créditos y progreso
  const { totalCreditos, creditosAprobados, progressPercentage } = useMemo(() => {
    const total = mallas.reduce((s, m) => s + m.creditos, 0)
    const aprobados = Array.from(processedCourses.values())
      .filter((c) => c.currentStatus === "APROBADO")
      .reduce((s, c) => s + c.credits, 0)
    const pct = total > 0 ? Math.round((aprobados / total) * 100) : 0
    return { totalCreditos: total, creditosAprobados: aprobados, progressPercentage: pct }
  }, [mallas, processedCourses])

  return {
    asignaturaMap,
    processedCourses,
    filteredCoursesBySemester,
    totalCreditos,
    creditosAprobados,
    progressPercentage,
  }
}
