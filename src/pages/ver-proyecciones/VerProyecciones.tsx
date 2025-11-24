import { Link } from "react-router-dom";
import NavigationUcn from "../../components/NavigationUcn";
import { useVerProyecciones } from "./hooks/useVerProyecciones";

// Componentes de presentación
import ProyeccionesHeader from "./components/ProyeccionesHeader";
import ProyeccionCard from "./components/ProyeccionCard";
import EmptyState from "./components/EmptyState";

const VerProyecciones = () => {
  const { loading, error, proyecciones, codigo, handleDelete, navigate } = useVerProyecciones();

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
                onDelete={handleDelete}
                onView={(id) => navigate(`/proyeccion/${id}`)}
              />
            ))}
          </div>
        )}
        <div className="mt-4">
          <Link  to="/ver-proyecciones/comparar/:codigoCarrera" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Comparar proyecciones
        </Link>
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