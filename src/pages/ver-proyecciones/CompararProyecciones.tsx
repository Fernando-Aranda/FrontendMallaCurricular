import { useState } from "react";
import { useVerProyecciones } from "./hooks/useVerProyecciones";
import NavigationUcn from "../../components/NavigationUcn";

const CompararProyecciones = () => {
  const { proyecciones, codigo, loading, error } = useVerProyecciones();
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);

  if (loading) return <div>Cargando proyecciones...</div>;
  if (error) return <div>Error: {error}</div>;

  const toggleSeleccion = (id: string) => {
    setSeleccionadas(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const proyA = proyecciones.find(p => p.id === seleccionadas[0]);
  const proyB = proyecciones.find(p => p.id === seleccionadas[1]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <NavigationUcn codigoCarrera={codigo} />
      <h1 className="text-2xl font-bold mb-6">Comparar Proyecciones</h1>

      {/* Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {proyecciones.map(p => (
          <button
            key={p.id}
            onClick={() => toggleSeleccion(p.id)}
            className={`p-4 border rounded-lg ${
              seleccionadas.includes(p.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-100"
            }`}
          >
            <p className="font-semibold">{p.nombre}</p>
            <p className="text-gray-500 text-sm">{p.codigoCarrera}</p>
          </button>
        ))}
      </div>

      {/* Comparación */}
      {seleccionadas.length === 2 && proyA && proyB && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">{proyA.nombre}</h2>
            <p><strong>RUT:</strong> {proyA.rut}</p>
            <p><strong>Carrera:</strong> {proyA.codigoCarrera}</p>
            <p><strong>Total ramos:</strong> {proyA.ramos.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">{proyB.nombre}</h2>
            <p><strong>RUT:</strong> {proyB.rut}</p>
            <p><strong>Carrera:</strong> {proyB.codigoCarrera}</p>
            <p><strong>Total ramos:</strong> {proyB.ramos.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompararProyecciones;
