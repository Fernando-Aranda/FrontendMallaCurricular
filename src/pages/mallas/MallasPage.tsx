"use client"

// src/pages/mallas/MallasPage.tsx
import { useMallas } from "../../hooks/useMallas"
import { useState } from "react"
import Navigation from "../../components/Navigation"
import { useParams } from "react-router-dom"

const COLORS = {
  darkPurple: "#32292F", // Headers, dark elements
  mediumPurple: "#575366", // Course cards, secondary elements
  blueGray: "#6E7DAB", // Prerequisite tooltips
  brightBlue: "#5762D5", // Hover states, accents
  lightMint: "#D1E3DD", // Light text, subtle backgrounds
  white: "#FFFFFF", // Main background
}

const MallasPage = () => {
  const { mallas, loading, error } = useMallas()
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const { id } = useParams<{ id: string }>()

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg" style={{ color: COLORS.blueGray }}>
          Cargando mallas...
        </p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    )

  const coursesBySemester = mallas.reduce(
    (acc, course) => {
      const semester = course.nivel || 1
      if (!acc[semester]) {
        acc[semester] = []
      }
      acc[semester].push(course)
      return acc
    },
    {} as Record<number, typeof mallas>,
  )

  const semesters = Object.keys(coursesBySemester)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div style={{ backgroundColor: COLORS.white }}>
      <Navigation carreraId={id || "8266"} />

      <div className="min-h-screen p-8">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: COLORS.darkPurple }}>
          Listado de Mallas
        </h2>

        <div className="overflow-x-auto">
          <div className="inline-flex gap-4 min-w-full pb-4">
            {semesters.map((semester) => (
              <div key={semester} className="flex-shrink-0" style={{ width: "280px" }}>
                {/* Semester header */}
                <div
                  className="rounded-t-lg p-4 text-center font-bold text-white mb-2"
                  style={{ backgroundColor: COLORS.darkPurple }}
                >
                  Semestre {semester}
                </div>

                {/* Course cards */}
                <div className="flex flex-col gap-3">
                  {coursesBySemester[semester].map((course) => (
                    <div
                      key={course.codigo}
                      className="relative rounded-lg p-4 shadow-md transition-all duration-200 cursor-pointer"
                      style={{
                        backgroundColor: hoveredCourse === course.codigo ? COLORS.brightBlue : COLORS.mediumPurple,
                      }}
                      onMouseEnter={() => setHoveredCourse(course.codigo)}
                      onMouseLeave={() => setHoveredCourse(null)}
                    >
                      <div className="text-white">
                        <p className="font-bold text-sm mb-1">{course.codigo}</p>
                        <p className="text-sm font-medium mb-2">{course.asignatura}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span style={{ color: COLORS.lightMint }}>Créditos: {course.creditos}</span>
                        </div>
                      </div>

                      {hoveredCourse === course.codigo && course.prereq && (
                        <div
                          className="absolute left-0 right-0 top-full mt-2 z-10 p-3 rounded-lg shadow-xl"
                          style={{
                            backgroundColor: COLORS.blueGray,
                            border: `2px solid ${COLORS.brightBlue}`,
                          }}
                        >
                          <p className="text-xs font-semibold mb-1" style={{ color: COLORS.lightMint }}>
                            Prerequisitos:
                          </p>
                          <p className="text-xs text-white whitespace-pre-wrap">{course.prereq}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {mallas.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: COLORS.mediumPurple }}>No hay cursos disponibles en esta malla.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MallasPage
