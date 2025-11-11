import { Link } from "react-router-dom";

interface EmptyStateProps {
  codigoCarrera?: string;
}

const EmptyState = ({ codigoCarrera }: EmptyStateProps) => {
  return (
    <div className="text-gray-600 text-center mt-12 bg-white p-12 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-slate-700">Aún no tienes proyecciones</h2>
      <p className="mt-2">¡Planifica tu futuro académico ahora!</p>
      <div className="mt-6">
        <Link
          to={`/crear-proyeccion/${codigoCarrera}`}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Crear mi primera proyección
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;