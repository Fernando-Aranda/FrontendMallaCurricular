import { useEffect, useState } from "react";
import type { Avance } from "../types/avance";
import { getAvance } from "../services/avanceService";
import { useAuth } from "../context/AuthContext";

export const useAvance = () => {
  const { token, user } = useAuth();
  const [avance, setAvance] = useState<Avance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const rut = user.rut;
        const carrera = user.carreras[0];
        const data = await getAvance(token, rut, carrera.codigo);
        setAvance(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el avance curricular");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  return { avance, loading, error };
};