import { useMemo } from "react"

export const useMallasBySemester = (mallas: any[]) => {
  return useMemo(() => {
    const grouped = mallas.reduce((acc, course) => {
      const semester = course.nivel || 1
      if (!acc[semester]) acc[semester] = []
      acc[semester].push(course)
      return acc
    }, {} as Record<number, any[]>)

    const semesters = Object.keys(grouped).map(Number).sort((a, b) => a - b)

    return { grouped, semesters }
  }, [mallas])
}
