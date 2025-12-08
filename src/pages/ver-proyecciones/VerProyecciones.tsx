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
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn codigoCarrera={codigo} />
        <div className="p-8 text-center text-gray-600">
          Cargando tus proyecciones...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn codigoCarrera={codigo} />
        <div className="p-8 text-center text-red-500">
          {error}
          <div className="mt-4">
            <Link to="/home" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Volver al home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationUcn codigoCarrera={codigo} />

      <main className="p-8 max-w-7xl mx-auto">
        <ProyeccionesHeader codigoCarrera={codigo} />

        {proyecciones.length === 0 ? (
          <EmptyState codigoCarrera={codigo} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="mt-6">
          <button
            onClick={handleCompare}
            disabled={selectedForComparison.length !== 2}
            className={`px-6 py-2 rounded font-semibold transition-all ${
              selectedForComparison.length === 2
                ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Comparar proyecciones
          </button>
          {selectedForComparison.length > 0 && selectedForComparison.length < 2 && (
            <p className="text-sm text-slate-600 mt-2">
              Selecciona {2 - selectedForComparison.length} más para comparar
            </p>
          )}
        </div>
        <div>
          {showComparison && (
          <ComparisonModal projectionIds={selectedForComparison} onClose={() => setShowComparison(false)} />
          )}
        </div>
        <div className="mt-8">
          <Link to="/home" className="text-blue-500 hover:underline">
            ← Volver al home
          </Link>
        </div>
      </main>
    </div>
  );

  
};

export default VerProyecciones;