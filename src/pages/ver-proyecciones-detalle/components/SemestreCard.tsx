import type { RamoProyectado } from "../hooks/useVerProyeccionDetalle";

interface SemestreCardProps {
  semestre: string; // El número del semestre
  ramos: RamoProyectado[];
}

const SemestreCard = ({ semestre, ramos }: SemestreCardProps) => {
  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-orange-600 mb-3">
        Semestre {semestre}
      </h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {ramos.map((ramo, index) => (
          <li key={index}>
            <strong>{ramo.codigoRamo}</strong>
            {ramo.nombreRamo ? ` — ${ramo.nombreRamo}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SemestreCard;