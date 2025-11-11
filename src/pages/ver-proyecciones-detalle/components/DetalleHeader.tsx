import { Link } from "react-router-dom";

interface DetalleHeaderProps {
  nombreProyeccion: string;
  codigoCarrera: string;
}

const DetalleHeader = ({ nombreProyeccion, codigoCarrera }: DetalleHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Detalle de Proyección: {nombreProyeccion}
      </h1>
      <Link
        to={`/ver-proyecciones/${codigoCarrera}`}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
      >
        ← Volver a Mis Proyecciones
      </Link>
    </div>
  );
};

export default DetalleHeader;