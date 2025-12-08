"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAvance } from "../../hooks/useAvance"
import { useMallas } from "../../hooks/useMallas"
import NavigationUcn from "../../components/NavigationUcn"
import { useAvanceProcesado } from "./hooks/useAvanceProcesado"
import SemesterColumnAvance from "./components/SemesterColumnAvance"
import SidebarAvance from "./components/SidebarAvance"

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
)

const AvancePage = () => {
  const { codigo } = useParams<{ codigo: string }>()
  const { avance, loading: loadingAvance, error: errorAvance } = useAvance()
  const { mallas, loading: loadingMallas, error: errorMallas } = useMallas()
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Cargando malla...</p>
      </div>
    )

  if (errorAvance || errorMallas) return <p>{errorAvance || errorMallas}</p>

  const semesters = Array.from(filteredCoursesBySemester.keys()).sort((a, b) => a - b)
  const totalSemesters = semesters.length || 1

  return (
    // Usamos 'h-screen' y 'overflow-hidden' para asegurar que no haya scroll en la pagina principal
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <NavigationUcn codigoCarrera={codigo} />

      <div className="flex-1 flex flex-col p-4 w-full max-w-[100vw]">
        
        {/* Header Compacto */}
        <div className="flex justify-between items-center mb-4 px-2">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate">
            Mi Avance Curricular
          </h1>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded text-sm hover:bg-slate-700 transition z-10 whitespace-nowrap"
          >
            <FilterIcon />
            <span className="hidden md:inline">Filtros</span>
          </button>
        </div>

        {/* CONTENEDOR DE LA MALLA (100% Pantalla) */}
        <div className="flex-1 relative">
          {semesters.length > 0 ? (
            <div 
              className="absolute inset-0 grid gap-2"
              style={{
                // MAGIA: Creamos tantas columnas como semestres existan.
                // minmax(0, 1fr) permite que las columnas se encojan lo necesario.
                gridTemplateColumns: `repeat(${totalSemesters}, minmax(0, 1fr))`
              }}
            >
              {semesters.map((s) => (
                <SemesterColumnAvance 
                  key={s} 
                  semester={s} 
                  courses={filteredCoursesBySemester.get(s)!} 
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-white rounded border border-dashed border-gray-300">
              <p className="text-gray-400">Sin resultados para este filtro.</p>
            </div>
          )}
        </div>
      </div>

      <SidebarAvance
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filter={filter}
        setFilter={setFilter}
        progressPercentage={progressPercentage}
        creditosAprobados={creditosAprobados}
        totalCreditos={totalCreditos}
        aprobados={Array.from(processedCourses.values()).filter((c) => c.currentStatus === "APROBADO").length}
        reprobados={Array.from(processedCourses.values()).filter((c) => c.failedCount > 0).length}
        pendientes={Array.from(processedCourses.values()).filter((c) => c.currentStatus === "PENDIENTE").length}
      />
    </div>
  )
}

export default AvancePage