import { useMemo } from "react"
import type { Malla } from "../../../types/mallas"

export type CourseStatus = "APROBADO" | "REPROBADO" | "INSCRITO" | "PENDIENTE"

type GroupedCourse = {
  courseCode: string
  courseName: string
  credits: number
  currentStatus: CourseStatus
  failedCount: number
  latestPeriod: string | null
  latestNrc: string | null
  level: number
}

export const useAvanceProcesado = (avance: any[], mallas: Malla[], filter: string) => {
  
  const { processedCourses, totalCreditos, creditosAprobados, progressPercentage } = useMemo(() => {
    const avanceMap = new Map<string, any[]>()
    
    if (avance) {
      avance.forEach(record => {
        if (!avanceMap.has(record.course)) {
          avanceMap.set(record.course, [])
        }
        avanceMap.get(record.course)!.push(record)
      })
    }

    const processed = new Map<string, GroupedCourse>()
    let accTotalCreditos = 0
    let accCreditosAprobados = 0

    mallas.forEach((mallaItem) => {
      accTotalCreditos += mallaItem.creditos
      
      const historial = avanceMap.get(mallaItem.codigo) || []
      
      const aprobado = historial.find(h => h.status === "APROBADO")
      const inscrito = historial.find(h => h.status === "INSCRITO")
      const failedCount = historial.filter(h => h.status === "REPROBADO").length
      
      let currentStatus: CourseStatus = "PENDIENTE"
      let relevantRecord = null

      if (aprobado) {
        currentStatus = "APROBADO"
        relevantRecord = aprobado
        accCreditosAprobados += mallaItem.creditos
      } else if (inscrito) {
        currentStatus = "INSCRITO"
        relevantRecord = inscrito
      } else if (historial.length > 0) {
        currentStatus = "REPROBADO"
        relevantRecord = historial.sort((a, b) => b.period.localeCompare(a.period))[0]
      }
      
      processed.set(mallaItem.codigo, {
        courseCode: mallaItem.codigo,
        courseName: mallaItem.asignatura,
        credits: mallaItem.creditos,
        currentStatus, 
        failedCount,
        latestPeriod: relevantRecord ? relevantRecord.period : null,
        latestNrc: relevantRecord ? relevantRecord.nrc : null,
        level: mallaItem.nivel
      })
    })

    const pct = accTotalCreditos > 0 ? Math.round((accCreditosAprobados / accTotalCreditos) * 100) : 0

    return { 
      processedCourses: processed, 
      totalCreditos: accTotalCreditos, 
      creditosAprobados: accCreditosAprobados, 
      progressPercentage: pct 
    }
  }, [avance, mallas])

  const filteredCoursesBySemester = useMemo(() => {
    const grouped = new Map<number, GroupedCourse[]>()
    
    processedCourses.forEach((course) => {
      let include = false

      if (filter === "TODOS") {
        include = true
      } 
      else if (filter === "REPROBADO") {
        include = course.failedCount > 0
      } 
      else {
        include = course.currentStatus === filter
      }

      if (include) {
        if (!grouped.has(course.level)) grouped.set(course.level, [])
        grouped.get(course.level)!.push(course)
      }
    })
    
    return grouped
  }, [processedCourses, filter])

  return {
    processedCourses,
    filteredCoursesBySemester,
    totalCreditos,
    creditosAprobados,
    progressPercentage,
  }
}