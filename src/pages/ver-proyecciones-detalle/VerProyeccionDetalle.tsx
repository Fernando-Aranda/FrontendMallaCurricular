import { Link } from "react-router-dom";
import { useVerProyeccionDetalle } from "./hooks/useVerProyeccionDetalle";

// Componentes de presentación
import DetalleHeader from "./components/DetalleHeader";
import SemestreCard from "./components/SemestreCard";

const VerProyeccionDetalle = () => {
  const { loading, error, proyeccion, ramosPorSemestre } = useVerProyeccionDetalle();

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Cargando detalles de la proyección...
      </div>
    );
  }

  if (error || !proyeccion) {
    return (
      <div className="p-8 text-center text-red-500">
        {error || "No se encontró la proyección solicitada."}
        <div className="mt-4">
          <Link
            to="/home"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Volver al home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <DetalleHeader
        nombreProyeccion={proyeccion.nombre}
        codigoCarrera={proyeccion.codigoCarrera}
      />

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <p className="text-gray-600 mb-2">
          <strong>RUT:</strong> {proyeccion.rut}
        </p>
        <p className="text-gray-600 mb-6">
          <strong>Carrera:</strong> {proyeccion.codigoCarrera}
        </p>

        {Object.entries(ramosPorSemestre).map(([semestre, ramos]) => (
          <SemestreCard key={semestre} semestre={semestre} ramos={ramos} />
        ))}

        {proyeccion.ramos.length === 0 && (
          <p className="text-gray-500 italic">
            Esta proyección no contiene ramos asignados.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerProyeccionDetalle;