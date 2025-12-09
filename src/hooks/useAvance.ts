import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

export const useAvance = (codigoCarreraProp?: string) => {
  const { user, token } = useAuth();
  const params = useParams();

  const codigoActual = codigoCarreraProp || params.codigoCarrera || params.codigo;

  const [avance, setAvance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) return;


    if (!codigoActual) {
      console.warn("useAvance: Falta código de carrera");
      setLoading(false); 
      return;
    }

    const fetchAvance = async () => {
      try {
        setLoading(true);
        const rut = user.rut;
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

        console.log(`Buscando avance para RUT: ${rut} y Carrera: ${codigoActual}`);
        
        const res = await axios.get<any[]>(
          `${apiUrl}/estudiantes/avance/${rut}/${codigoActual}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAvance(res.data);
        setError(null);
      } catch (err: any) {
        console.error("Error cargando avance:", err);
        setError("Error al cargar el avance curricular.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvance();
  }, [user, token, codigoActual]);

  return { avance, loading, error };
};