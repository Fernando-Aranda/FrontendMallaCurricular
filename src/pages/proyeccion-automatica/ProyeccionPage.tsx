"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import NavigationUcn from "../../components/NavigationUcn"
import { useProyeccionAutomatica } from "./hooks/useProyeccionAutomatica"
import ProjectionColumn from "./components/ProjectionColumn"
import { useAuth } from "../../context/AuthContext"
import { saveProyeccionAutomatica } from "../../api/services/proyeccionesService"

const ProyeccionPage = () => {
  const { codigo } = useParams<{ codigo: string }>()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  
  // Hook existente
  const { proyeccion, loading, error } = useProyeccionAutomatica(codigo || "")
  
  // Estado para el guardado
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!token || !user || !codigo) return
    
    const nombreDefault = `Proyección Auto - ${new Date().toLocaleDateString('es-CL')}`
    // Opcional: Podrías usar un prompt o un modal para pedir el nombre
    // const nombre = prompt("Nombre de la proyección:", nombreDefault) || nombreDefault
    
    try {
      setSaving(true)
      const catalogo = user.carreras[0].catalogo
      
      // Llamada al backend
      const result = await saveProyeccionAutomatica(token, user.rut, codigo, catalogo, nombreDefault)
      
      // Éxito: Redirigir al detalle de la proyección guardada
      navigate(`/proyeccion/${result.id}`)
      
    } catch (err) {
      console.error(err)
      alert("Error al guardar la proyección")
    } finally {
      setSaving(false)
    }
  }

  // ... (Bloques de Loading y Error se mantienen igual) ...
  if (loading) return <div className="p-10 text-center">Cargando...</div>
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>

  const totalPeriodos = proyeccion.length || 1

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      <NavigationUcn codigoCarrera={codigo} />

      <main className="flex-1 flex flex-col p-4 w-full max-w-[100vw]">
        
        {/* Header con Botón de Guardar */}
        <div className="flex justify-between items-end mb-4 px-2 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Proyección Inteligente</h1>
            <p className="text-sm text-slate-500">
              Ruta sugerida basada en tu avance actual.
            </p>
          </div>
          
          <div className="flex gap-3 items-center">
            <div className="hidden md:block bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-600 shadow-sm">
              {proyeccion.length} Periodos estimados
            </div>
            
            {/* BOTÓN DE GUARDAR */}
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
                    Guardar en Historial
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* CONTENEDOR GRID (Mismo de antes) */}
        <div className="flex-1 relative">
           {/* ... (Todo el código del Grid se mantiene igual) ... */}
           <div 
              className="absolute inset-0 grid gap-3"
              style={{ gridTemplateColumns: `repeat(${totalPeriodos}, minmax(0, 1fr))` }}
            >
              {proyeccion.map((semestre) => (
                <ProjectionColumn key={semestre.periodo} data={semestre} />
              ))}
            </div>
        </div>
      </main>
    </div>
  )
}

export default ProyeccionPage