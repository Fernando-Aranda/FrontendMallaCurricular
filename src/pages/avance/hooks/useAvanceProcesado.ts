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
    // 1. Agrupar historial
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

    // 2. Procesar Malla
    mallas.forEach((mallaItem) => {
      accTotalCreditos += mallaItem.creditos
      
      const historial = avanceMap.get(mallaItem.codigo) || []
      
      const aprobado = historial.find(h => h.status === "APROBADO")
      const inscrito = historial.find(h => h.status === "INSCRITO")
      // Contamos cuantas veces aparece "REPROBADO" en el historial
      const failedCount = historial.filter(h => h.status === "REPROBADO").length
      
      let currentStatus: CourseStatus = "PENDIENTE"
      let relevantRecord = null

      // Lógica de Prioridad para el Estado ACTUAL
      if (aprobado) {
        currentStatus = "APROBADO"
        relevantRecord = aprobado
        accCreditosAprobados += mallaItem.creditos
      } else if (inscrito) {
        currentStatus = "INSCRITO"
        relevantRecord = inscrito
      } else if (historial.length > 0) {
        // Si hay historial pero no está aprobado ni inscrito, asumimos que el último estado es reprobado
        currentStatus = "REPROBADO"
        relevantRecord = historial.sort((a, b) => b.period.localeCompare(a.period))[0]
      }
      
      processed.set(mallaItem.codigo, {
        courseCode: mallaItem.codigo,
        courseName: mallaItem.asignatura,
        credits: mallaItem.creditos,
        currentStatus, 
        failedCount, // Guardamos el conteo histórico
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

  // 3. Filtrado (AQUÍ ESTÁ LA CORRECCIÓN)
  const filteredCoursesBySemester = useMemo(() => {
    const grouped = new Map<number, GroupedCourse[]>()
    
    processedCourses.forEach((course) => {
      let include = false

      if (filter === "TODOS") {
        include = true
      } 
      else if (filter === "REPROBADO") {
        // CORRECCIÓN:
        // Antes mirábamos course.currentStatus === 'REPROBADO'.
        // Ahora miramos course.failedCount > 0.
        // Esto incluirá ramos que se reprobaron antes pero ahora están aprobados o inscritos.
        include = course.failedCount > 0
      } 
      else {
        // Para filtros "APROBADO", "INSCRITO", "PENDIENTE"
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