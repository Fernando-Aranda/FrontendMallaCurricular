import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Malla } from "../types/mallas";
import { getMalla } from "../api/services/mallasService";
import { useAuth } from "../context/AuthContext";

export const useMallas = (codigoCarreraProp?: string) => {
  const { token, user } = useAuth();
  const params = useParams();
  
  const codigoActual = codigoCarreraProp || params.codigoCarrera || params.codigo;

  const [mallas, setMallas] = useState<Malla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (!token || !user) return;

    if (!codigoActual) {
      console.warn("useMallas: Falta código de carrera");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const carreraUsuario = user.carreras.find(c => String(c.codigo) === String(codigoActual));

        if (!carreraUsuario) {
          setError("No tienes acceso a esta carrera.");
          setLoading(false);
          return;
        }

        const catalogo = carreraUsuario.catalogo; 
        const cacheKey = `malla_cache_${codigoActual}_${catalogo}`;

        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedMalla = JSON.parse(cachedData);
          if (Array.isArray(parsedMalla) && parsedMalla.length > 0) {
            setMallas(parsedMalla);
            setLoading(false);
            console.log(`Malla ${codigoActual} cargada desde caché ⚡`);
            return;
          }
        }
        
        console.log(`Buscando malla para: ${codigoActual} - Catálogo: ${catalogo}`);
        const data = await getMalla(token, String(codigoActual), catalogo);

        if (data && data.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }

        setMallas(data);
        setError(null);

      } catch (err) {
        console.error(err);
        setError("Error al cargar la malla curricular");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user, codigoActual]);

  return { mallas, loading, error };
};