import type { Proyeccion } from "../hooks/useVerProyecciones";

interface ProyeccionCardProps {
  proyeccion: Proyeccion;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const ProyeccionCard = ({ proyeccion, onDelete, onView }: ProyeccionCardProps) => {
  return (
    <div className="bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          {proyeccion.nombre}
        </h2>
        <p className="text-slate-600 text-sm mt-2">
          Creada el:{" "}
          {new Date(proyeccion.fechaCreacion).toLocaleDateString("es-CL")}
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => onView(proyeccion.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Ver Detalle
        </button>
        <button
          onClick={() => onDelete(proyeccion.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProyeccionCard;