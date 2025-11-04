import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface RamoProyectado {
  codigoRamo: string;
  semestre: number;
  nombreRamo?: string; // Se puede completar dinámicamente si tu API lo entrega
}

interface Proyeccion {
  id: number;
  nombre: string;
  rut: string;
  codigoCarrera: string;
  ramos: RamoProyectado[];
}

const VerProyeccionDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [proyeccion, setProyeccion] = useState<Proyeccion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProyeccion = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<Proyeccion>(
          `http://localhost:3000/proyecciones/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProyeccion(response.data);
      } catch (err) {
        console.error("Error al cargar la proyección:", err);
        setError("No se pudo cargar la proyección seleccionada.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProyeccion();
  }, [id, token]);

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
            to="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Agrupar ramos por semestre
  const ramosPorSemestre = proyeccion.ramos.reduce<Record<number, RamoProyectado[]>>(
    (acc, ramo) => {
      if (!acc[ramo.semestre]) acc[ramo.semestre] = [];
      acc[ramo.semestre].push(ramo);
      return acc;
    },
    {}
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Detalle de Proyección: {proyeccion.nombre}
        </h1>
        <Link
          to={`/ver-proyecciones/${proyeccion.codigoCarrera}`}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          ← Volver a Mis Proyecciones
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <p className="text-gray-600 mb-2">
          <strong>RUT:</strong> {proyeccion.rut}
        </p>
        <p className="text-gray-600 mb-6">
          <strong>Carrera:</strong> {proyeccion.codigoCarrera}
        </p>

        {Object.entries(ramosPorSemestre).map(([semestre, ramos]) => (
          <div
            key={semestre}
            className="mb-8 border border-gray-200 rounded-lg p-4 shadow-sm"
          >
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
