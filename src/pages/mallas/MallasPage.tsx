"use client"

// src/pages/mallas/MallasPage.tsx
import { useMallas } from "../../hooks/useMallas"
import { useState } from "react"
import { useParams } from "react-router-dom"
// 1. IMPORTAMOS EL NUEVO COMPONENTE DE NAVEGACIÓN
import NavigationUcn from "../../components/NavigationUcn"

// 2. USAMOS LA PALETA DE COLORES ESTANDARIZADA
const COLORS = {
  background: "#F9FAFB", // bg-gray-50
  primary: {
    dark: "#1E293B", // bg-slate-800
    main: "#3B82F6", // bg-blue-500
  },
  text: {
    primary: "#1F2937",
    secondary: "#4B5563",
    onDark: "#FFFFFF",
    onDarkMuted: "#CBD5E1", // text-slate-300
  },
  error: "#DC2626", // text-red-600
}

const MallasPage = () => {
  const { mallas, loading, error } = useMallas()
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  // 3. ESTANDARIZAMOS EL PARÁMETRO DE LA URL A 'codigo'
  const { codigo } = useParams<{ codigo: string }>()

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Usamos el nuevo navegador incluso en el estado de carga */}
        <NavigationUcn />
        <div className="flex items-center justify-center p-8">
          <p className="text-lg text-gray-600">Cargando malla curricular...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn />
        <div className="flex items-center justify-center p-8">
          <p className="text-lg text-red-600">{error}</p>
        </div>
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
    // 4. APLICAMOS EL NUEVO TEMA VISUAL CON TAILWIND CSS
    <div className="min-h-screen bg-gray-50">
      <NavigationUcn codigoCarrera={codigo} />

      <main className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">
          Malla Curricular
        </h2>

        <div className="overflow-x-auto">
          <div className="inline-flex gap-4 min-w-full pb-4">
            {semesters.map((semester) => (
              <div key={semester} className="flex-shrink-0 w-[280px]">
                {/* Cabecera del Semestre */}
                <div className="rounded-t-lg p-4 text-center font-bold text-white mb-2 bg-slate-800">
                  Semestre {semester}
                </div>

                {/* Tarjetas de los Cursos */}
                <div className="flex flex-col gap-3">
                  {coursesBySemester[semester].map((course) => (
                    <div
                      key={course.codigo}
                      className={`relative rounded-lg p-4 shadow-md transition-all duration-200 cursor-pointer text-white
                        ${hoveredCourse === course.codigo ? 'bg-blue-600' : 'bg-slate-700'}
                      `}
                      onMouseEnter={() => setHoveredCourse(course.codigo)}
                      onMouseLeave={() => setHoveredCourse(null)}
                    >
                      <div>
                        <p className="font-bold text-sm mb-1">{course.codigo}</p>
                        <p className="text-sm font-medium mb-2">{course.asignatura}</p>
                        <div className="flex justify-between items-center text-xs text-slate-300">
                          <span>Créditos: {course.creditos}</span>
                        </div>
                      </div>

                      {/* Tooltip de Prerrequisitos */}
                      {hoveredCourse === course.codigo && course.prereq && (
                        <div className="absolute left-0 right-0 top-full mt-2 z-10 p-3 rounded-lg shadow-xl bg-slate-600 border-2 border-blue-500">
                          <p className="text-xs font-semibold mb-1 text-slate-200">Prerrequisitos:</p>
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
            <p className="text-gray-500">No hay cursos disponibles en esta malla.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default MallasPage