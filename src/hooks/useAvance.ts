import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import type { Avance } from "../types/avance";
import { getAvance } from "../api/services/avanceService";
import { useAuth } from "../context/AuthContext";

export const useAvance = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const { token, user } = useAuth();
  const [avance, setAvance] = useState<Avance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user || !codigo) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const rut = user.rut;
        
        const data = await getAvance(token, rut, codigo);

        setAvance(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el avance curricular");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user, codigo]);

  return { avance, loading, error };
};