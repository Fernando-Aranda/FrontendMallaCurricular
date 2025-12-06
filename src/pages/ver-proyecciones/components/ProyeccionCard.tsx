import type { Proyeccion } from "../hooks/useVerProyecciones";

interface ProyeccionCardProps {
  proyeccion: Proyeccion;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

const ProyeccionCard = ({ proyeccion, onDelete, onView,isSelected, onSelect }: ProyeccionCardProps) => {
  return (
    <div className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
      onClick={onSelect}>
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