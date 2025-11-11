"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAvance } from "../../hooks/useAvance"
import { useMallas } from "../../hooks/useMallas"
import NavigationUcn from "../../components/NavigationUcn"
import { useAvanceProcesado } from "./hooks/useAvanceProcesado"
import SemesterColumnAvance from "./components/SemesterColumnAvance"
import SidebarAvance from "./components/SidebarAvance"

const AvancePage = () => {
  const { codigo } = useParams<{ codigo: string }>()
  const { avance, loading: loadingAvance, error: errorAvance } = useAvance()
  const { mallas, loading: loadingMallas, error: errorMallas } = useMallas()
  const [filter, setFilter] = useState("TODOS")

  const {
    filteredCoursesBySemester,
    processedCourses,
    totalCreditos,
    creditosAprobados,
    progressPercentage,
  } = useAvanceProcesado(avance, mallas, filter)

  if (loadingAvance || loadingMallas)
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn />
        <p className="p-8 text-center text-lg text-gray-600">Cargando datos...</p>
      </div>
    )

  if (errorAvance || errorMallas)
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn />
        <p className="p-8 text-center text-lg text-red-600">{errorAvance || errorMallas}</p>
      </div>
    )

  const semesters = Array.from(filteredCoursesBySemester.keys()).sort((a, b) => a - b)

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationUcn codigoCarrera={codigo} />

      <div className="flex">
        <div className="flex-1 p-8 overflow-x-auto">
          <h1 className="text-3xl font-bold mb-6 text-slate-800">Mi Avance Curricular</h1>
          <div className="inline-flex gap-4 min-w-full pb-4">
            {semesters.map((s) => (
              <SemesterColumnAvance key={s} semester={s} courses={filteredCoursesBySemester.get(s)!} />
            ))}
          </div>

          {semesters.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No hay cursos que coincidan con el filtro seleccionado.
            </p>
          )}
        </div>

        <SidebarAvance
          filter={filter}
          setFilter={setFilter}
          progressPercentage={progressPercentage}
          creditosAprobados={creditosAprobados}
          totalCreditos={totalCreditos}
          aprobados={Array.from(processedCourses.values()).filter((c) => c.currentStatus === "APROBADO").length}
          reprobados={Array.from(processedCourses.values()).filter((c) => c.failedCount > 0).length}
        />
      </div>
    </div>
  )
}

export default AvancePage
