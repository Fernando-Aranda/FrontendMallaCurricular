import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

// --- TIPOS EXPORTADOS PARA LOS COMPONENTES ---
export interface RamoProyectado {
  codigoRamo: string;
  semestre: number;
  nombreRamo?: string;
}

export interface Proyeccion {
  id: number;
  nombre: string;
  rut: string;
  codigoCarrera: string;
  ramos: RamoProyectado[];
}
// ---------------------------------------------

export const useVerProyeccionDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [proyeccion, setProyeccion] = useState<Proyeccion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efecto para buscar los datos de la proyección
  useEffect(() => {
    const fetchProyeccion = async () => {
      if (!id || !token) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<Proyeccion>(
          `http://localhost:3000/proyecciones/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProyeccion(response.data);
      } catch (err) {
        console.error("Error al cargar la proyección:", err);
        setError("No se pudo cargar la proyección seleccionada.");
      } finally {
        setLoading(false);
      }
    };

    fetchProyeccion();
  }, [id, token]);

  // Dato derivado: Agrupamos los ramos por semestre usando useMemo para eficiencia
  const ramosPorSemestre = useMemo(() => {
    if (!proyeccion) return {};

    return proyeccion.ramos.reduce<Record<number, RamoProyectado[]>>(
      (acc, ramo) => {
        if (!acc[ramo.semestre]) acc[ramo.semestre] = [];
        acc[ramo.semestre].push(ramo);
        return acc;
      },
      {}
    );
  }, [proyeccion]);

  return {
    loading,
    error,
    proyeccion,
    ramosPorSemestre,
  };
};