import { Link } from "react-router-dom";

interface ProyeccionesHeaderProps {
  codigoCarrera?: string;
}

const ProyeccionesHeader = ({ codigoCarrera }: ProyeccionesHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-slate-800">
        Mis Proyecciones — {codigoCarrera}
      </h1>
      <Link
        to={`/crear-proyeccion/${codigoCarrera}`}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
      >
        + Nueva Proyección
      </Link>
    </div>
  );
};

export default ProyeccionesHeader;