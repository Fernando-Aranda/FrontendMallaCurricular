import { Link } from "react-router-dom";

interface CarreraCardProps {
  carrera: {
    codigo: string;
    nombre: string;
  };
}

const CarreraCard = ({ carrera }: CarreraCardProps) => (
  <div className="p-6 border rounded-lg shadow-sm bg-white">
    <h2 className="text-xl font-semibold text-slate-800">
      {carrera.nombre} ({carrera.codigo})
    </h2>

    <div className="mt-4 flex flex-wrap gap-4">
      <Link
        to={`/malla/${carrera.codigo}`}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
      >
        Ver Malla
      </Link>

      <Link
        to={`/avance/${carrera.codigo}`}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
      >
        Ver Avance
      </Link>

      <Link
        to={`/crear-proyeccion/${carrera.codigo}`}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
      >
        Crear Proyección
      </Link>

      <Link
        to={`/ver-proyecciones/${carrera.codigo}`}
        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold"
      >
        Mis Proyecciones
      </Link>
    </div>
  </div>
);

export default CarreraCard;
