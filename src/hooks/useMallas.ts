// src/hooks/useMallas.ts
import { useEffect, useState } from "react";
import type { Malla } from "../types/mallas";
import { getMalla } from "../services/mallasService";
import { useAuth } from "../context/AuthContext";

export const useMallas = () => {
  const { token, user } = useAuth();
  const [mallas, setMallas] = useState<Malla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // ⚡ Usa la primera carrera del estudiante (puedes mejorar esto)
        const carrera = user.carreras[0];
        const data = await getMalla(token, carrera.codigo, carrera.catalogo);

        setMallas(data);
      } catch {
        setError("Error al cargar la malla curricular");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  return { mallas, loading, error };
};
