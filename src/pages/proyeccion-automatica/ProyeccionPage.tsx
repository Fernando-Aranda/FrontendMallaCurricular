"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import NavigationUcn from "../../components/NavigationUcn"
import { useProyeccionAutomatica } from "./hooks/useProyeccionAutomatica"
import ProjectionColumn from "./components/ProjectionColumn"
import { useAuth } from "../../context/AuthContext"
import { saveProyeccionAutomatica } from "../../api/services/proyeccionesService"

const ProyeccionPage = () => {
  // 1. Leer parámetro consistente (:codigoCarrera)
  const { codigo } = useParams<{ codigo: string }>() // Legacy support si ruta es :codigo
  const { codigoCarrera } = useParams<{ codigoCarrera: string }>()
  
  // Usamos el que venga (priorizando codigoCarrera si actualizaste App.tsx)
  const codigoActual = codigoCarrera || codigo || ""

  const navigate = useNavigate()
  const { token, user } = useAuth()
  
  // Hook con lógica corregida
  const { proyeccion, loading, error } = useProyeccionAutomatica(codigoActual)
  
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!token || !user || !codigoActual) return
    
    const nombreDefault = `Proyección Auto - ${new Date().toLocaleDateString('es-CL')}`
    
    try {
      setSaving(true)
      
      // 2. BUSCAR CATÁLOGO PARA GUARDAR
      const carreraActual = user.carreras.find(c => String(c.codigo) === String(codigoActual))
      
      if (!carreraActual) {
          alert("Error: No se encontró información de la carrera.")
          return
      }

      const catalogo = carreraActual.catalogo // Catálogo correcto
      
      const result = await saveProyeccionAutomatica(token, user.rut, codigoActual, catalogo, nombreDefault)
      
      navigate(`/proyeccion/${result.id}`)
      
    } catch (err) {
      console.error(err)
      alert("Error al guardar la proyección")
    } finally {
      setSaving(false)
    }
  }

  // Lógica de Renderizado
  const totalPeriodos = proyeccion.length || 1

  return (
    // Layout fijo para evitar problemas de scroll
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      
      {/* Navigation siempre visible (asumiendo fixed layout en nav) */}
      <div className="flex-none">
         <NavigationUcn codigoCarrera={codigoActual} />
      </div>

      {/* Padding top compensatorio si el nav es fixed (ajustar pt-20 según altura nav) */}
      <main className="flex-1 flex flex-col p-4 w-full max-w-[100vw] overflow-hidden pt-20">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-4 px-2 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Proyección Inteligente</h1>
            <p className="text-sm text-slate-500">
              Ruta sugerida para la carrera <span className="font-mono font-bold text-slate-700">{codigoActual}</span>
            </p>
          </div>
          
          <div className="flex gap-3 items-center">
            {/* Badge de periodos */}
            {!loading && !error && (
                <div className="hidden md:block bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
                {proyeccion.length} Periodos estimados
                </div>
            )}
            
            {/* Botón Guardar */}
            {proyeccion.length > 0 && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-bold shadow-md transition-all
                  ${saving 
                    ? "bg-slate-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700 hover:shadow-lg active:scale-95"
                  }`}
              >
                {saving ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Guardar
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL */}
        <div className="flex-1 relative bg-white rounded-xl border border-slate-200 p-1 overflow-hidden">
           
           {loading ? (
              <div className="flex h-full items-center justify-center flex-col gap-3">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800"></div>
                 <p className="text-slate-500">Calculando ruta académica...</p>
              </div>
           ) : error ? (
              <div className="flex h-full items-center justify-center text-red-500 flex-col gap-2">
                 <p className="font-bold">Error al generar proyección</p>
                 <p className="text-sm">{error}</p>
                 <button onClick={() => window.location.reload()} className="text-blue-600 underline text-sm mt-2">Reintentar</button>
              </div>
           ) : proyeccion.length > 0 ? (
              <div 
                className="absolute inset-2 grid gap-3 overflow-x-auto overflow-y-hidden"
                style={{ 
                    // Grid dinámico que evita scroll horizontal excesivo ajustando ancho
                    gridTemplateColumns: `repeat(${totalPeriodos}, minmax(280px, 1fr))` 
                }}
              >
                {proyeccion.map((semestre) => (
                  <ProjectionColumn key={semestre.periodo} data={semestre} />
                ))}
              </div>
           ) : (
              <div className="flex h-full items-center justify-center text-slate-400 flex-col">
                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                 <p>No se encontraron asignaturas pendientes para proyectar.</p>
                 <p className="text-xs mt-2">Verifica que tu historial esté actualizado.</p>
              </div>
           )}
        </div>
      </main>
    </div>
  )
}

export default ProyeccionPage