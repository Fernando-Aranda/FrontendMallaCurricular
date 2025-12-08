import { Link } from "react-router-dom";
import { useState } from 'react';
import NavigationUcn from "../../components/NavigationUcn";
import { useVerProyecciones } from "./hooks/useVerProyecciones";

// Componentes de presentación
import ProyeccionesHeader from "./components/ProyeccionesHeader";
import ProyeccionCard from "./components/ProyeccionCard";
import EmptyState from "./components/EmptyState";
import ComparisonModal from './components/Comparacion';

const VerProyecciones = () => {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false)
  const { loading, error, proyecciones, codigo, handleDelete, navigate } = useVerProyecciones();

  const handleSelectProjection = (projectionId: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(projectionId)) {
        return prev.filter((id) => id !== projectionId)
      }
      if (prev.length < 2) {
        return [...prev, projectionId]
      }
      return prev
    })
  }

  const handleCompare = () => {
    if (selectedForComparison.length === 2) {
      setShowComparison(true)
    }
  }

  // --- ESTADOS DE CARGA Y ERROR ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavigationUcn codigoCarrera={codigo} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mb-4"></div>
           <p>Cargando tus proyecciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavigationUcn codigoCarrera={codigo} />
        <div className="flex flex-col items-center justify-center h-[80vh] text-center p-4">
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200 max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="font-medium mb-4">{error}</p>
            <Link to="/home" className="inline-block bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold hover:bg-red-50 transition-colors">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="min-h-screen bg-slate-50 pb-24"> {/* pb-24 para dar espacio a la barra flotante */}
      <NavigationUcn codigoCarrera={codigo} />

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <ProyeccionesHeader codigoCarrera={codigo} count={proyecciones.length} />

        {proyecciones.length === 0 ? (
          <EmptyState codigoCarrera={codigo} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {proyecciones.map((proyeccion) => (
              <ProyeccionCard
                key={proyeccion.id}
                proyeccion={proyeccion}
                isSelected={selectedForComparison.includes(proyeccion.id.toString())}
                onSelect={() => handleSelectProjection(proyeccion.id.toString())}
                onDelete={handleDelete}
                onView={(id) => navigate(`/proyeccion/${id}`)}
              />
            ))}
          </div>
        )}
        
        {/* Barra de Acción Flotante (Sticky Bottom) */}
        <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-xl transform transition-transform duration-300 z-40 ${selectedForComparison.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
               <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                 {selectedForComparison.length}
               </span>
               <p className="text-slate-700 font-medium">
                 {selectedForComparison.length === 2 ? 'Listo para comparar' : 'Selecciona 2 para comparar'}
               </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedForComparison([])}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleCompare}
                disabled={selectedForComparison.length !== 2}
                className={`px-6 py-2 rounded-lg font-bold text-white transition-all shadow-md ${
                  selectedForComparison.length === 2
                    ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                Comparar Proyecciones
              </button>
            </div>
          </div>
        </div>

        {/* Modal de Comparación */}
        {showComparison && (
          <ComparisonModal projectionIds={selectedForComparison} onClose={() => setShowComparison(false)} />
        )}

      </main>
    </div>
  );
};

export default VerProyecciones;