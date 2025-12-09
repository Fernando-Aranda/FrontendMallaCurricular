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
  const { codigoCarrera } = useParams<{ codigoCarrera: string }>()
  
  const { mallas, loading: loadingMallas, error: errorMallas } = useMallas(codigoCarrera)
  const { avance, loading: loadingAvance, error: errorAvance } = useAvance(codigoCarrera)
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [filter, setFilter] = useState("TODOS")

  const {
    filteredCoursesBySemester,
    processedCourses,
    totalCreditos,
    creditosAprobados,
    progressPercentage,
  } = useAvanceProcesado(avance, mallas, filter)

  const isLoading = loadingAvance || loadingMallas;
  const error = errorAvance || errorMallas;
  const semesters = Array.from(filteredCoursesBySemester.keys()).sort((a, b) => a - b)
  const totalSemesters = semesters.length || 1

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      
      {/* 1. Navigation siempre visible */}
      <NavigationUcn codigoCarrera={codigoCarrera} />

      <div className="flex-1 flex flex-col p-4 w-full max-w-[100vw]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex flex-col">
             <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate">
               Mi Avance Curricular
             </h1>
             <span className="text-xs text-slate-400 font-mono">Carrera: {codigoCarrera}</span>
          </div>
          
          <button
            onClick={() => setIsSidebarOpen(true)}
            disabled={isLoading || !!error} 
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition z-10 whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            <FilterIcon />
            <span className="hidden md:inline">Filtros</span>
          </button>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex-1 relative bg-slate-100/50 rounded-xl border border-slate-200/60 p-1 overflow-hidden">
          
          {isLoading ? (
            <div className="flex flex-col h-full items-center justify-center gap-3">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
               <p className="text-gray-500 font-medium">Cargando información...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col h-full items-center justify-center">
                <p className="text-red-500 font-medium mb-2">⚠️ {error}</p>
                <button onClick={() => window.location.reload()} className="text-blue-600 underline text-sm">Reintentar</button>
            </div>
          ) : semesters.length > 0 ? (
            <div 
              className="absolute inset-2 grid gap-2 overflow-hidden" // Quitamos scroll horizontal forzado
              style={{ 
                // MAGIA: minmax(0, 1fr) hace que todos quepan en pantalla sin scroll
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
            <div className="flex flex-col h-full items-center justify-center text-slate-400">
              <p>No se encontraron asignaturas.</p>
            </div>
          )}
        </div>
      </div>

      {!isLoading && !error && (
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
      )}
    </div>
  )
}

export default AvancePage