import type { Proyeccion } from "../hooks/useVerProyeccionDetalle";

interface InfoProyeccionProps {
  proyeccion: Proyeccion;
}

const InfoProyeccion = ({ proyeccion }: InfoProyeccionProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <p className="text-gray-600 mb-2">
        <strong>RUT:</strong> {proyeccion.rut}
      </p>
      <p className="text-gray-600 mb-6">
        <strong>Carrera:</strong> {proyeccion.codigoCarrera}
      </p>
      {/* El contenido de los semestres se renderizará como children */}
    </div>
  );
};
