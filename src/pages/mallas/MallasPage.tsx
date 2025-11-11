"use client"

import { useParams } from "react-router-dom"
import { useMallas } from "../../hooks/useMallas"
import NavigationUcn from "../../components/NavigationUcn"
import { useMallasBySemester } from "./hooks/useMallasBySemester"
import SemesterColumn from "./components/SemesterColumn"

const MallasPage = () => {
  const { mallas, loading, error } = useMallas()
  const { codigo } = useParams<{ codigo: string }>()

  const { grouped, semesters } = useMallasBySemester(mallas)

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationUcn codigoCarrera={codigo} />

      <main className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">
          Malla Curricular
        </h2>

        <div className="overflow-x-auto">
          <div className="inline-flex gap-4 min-w-full pb-4">
            {semesters.map((semester) => (
              <SemesterColumn
                key={semester}
                semester={semester}
                courses={grouped[semester]}
              />
            ))}
          </div>
        </div>

        {mallas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No hay cursos disponibles en esta malla.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default MallasPage
