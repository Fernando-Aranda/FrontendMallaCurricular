"use client"

import { useMemo } from "react" // Importante importar useMemo
import { useParams } from "react-router-dom"
import { useMallas } from "../../hooks/useMallas"
import NavigationUcn from "../../components/NavigationUcn"
import { useMallasBySemester } from "./hooks/useMallasBySemester"
import SemesterColumn from "./components/SemesterColumn"

const MallasPage = () => {
  const { mallas, loading, error } = useMallas()
  const { codigo } = useParams<{ codigo: string }>()

  const { grouped, semesters } = useMallasBySemester(mallas)
  const totalSemesters = semesters.length || 1

  // CREAMOS EL DICCIONARIO: { "CODIGO": "NOMBRE ASIGNATURA" }
  const courseMap = useMemo(() => {
    const map = new Map<string, string>()
    mallas.forEach((c) => {
      map.set(c.codigo, c.asignatura)
    })
    return map
  }, [mallas])

  if (loading)
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando malla curricular...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <NavigationUcn />
        <p className="text-lg text-red-600 font-bold">{error}</p>
      </div>
    )

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <NavigationUcn codigoCarrera={codigo} />

      <main className="flex-1 flex flex-col p-4 w-full max-w-[100vw]">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 flex-shrink-0">
          Malla Curricular
        </h2>

        <div className="flex-1 relative">
          {mallas.length > 0 ? (
            <div 
              className="absolute inset-0 grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${totalSemesters}, minmax(0, 1fr))`
              }}
            >
              {semesters.map((semester) => (
                <SemesterColumn
                  key={semester}
                  semester={semester}
                  courses={grouped[semester]}
                  courseMap={courseMap} // PASAMOS EL MAPA AQUÍ
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No hay cursos disponibles.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MallasPage