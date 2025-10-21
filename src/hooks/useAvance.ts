// src/hooks/useAvance.ts
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // 1. IMPORTAMOS useParams
import type { Avance } from "../types/avance";
import { getAvance } from "../services/avanceService";
import { useAuth } from "../context/AuthContext";

export const useAvance = () => {
  // 2. OBTENEMOS el parámetro de la URL que definimos en App.tsx (:codigoCarrera)
  const { codigo } = useParams<{ codigo: string }>();
  const { token, user } = useAuth();
  const [avance, setAvance] = useState<Avance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 3. AÑADIMOS la comprobación de que exista el código de carrera
    if (!token || !user || !codigo) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const rut = user.rut;
        
        // 4. USAMOS el código de carrera que viene de la URL, en lugar de user.carreras[0].codigo
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
  }, [token, user, codigo]); // 5. AÑADIMOS codigoCarrera a las dependencias

  return { avance, loading, error };
};