import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Malla } from "../types/mallas";
import { getMalla } from "../api/services/mallasService";
import { useAuth } from "../context/AuthContext";

export const useMallas = (codigoCarreraProp?: string) => {
  const { token, user } = useAuth();
  const params = useParams();
  
  // 1. OBTENER CÓDIGO (De props o URL)
  const codigoActual = codigoCarreraProp || params.codigoCarrera || params.codigo;

  const [mallas, setMallas] = useState<Malla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay datos básicos, no hacemos nada
    if (!token || !user) return;

    // 2. VALIDAR CÓDIGO
    if (!codigoActual) {
      console.warn("useMallas: Falta código de carrera");
      setLoading(false); // Importante: dejar de cargar
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 3. BUSCAR EL CATÁLOGO (CRÍTICO)
        // La API de Mallas EXIGE el catálogo. Lo sacamos de la info del usuario.
        // Buscamos la carrera que coincida con el código de la URL.
        const carreraUsuario = user.carreras.find(c => String(c.codigo) === String(codigoActual));

        if (!carreraUsuario) {
          setError("No tienes acceso a esta carrera.");
          setLoading(false);
          return;
        }

        const catalogo = carreraUsuario.catalogo; // ¡AQUÍ ESTÁ EL DATO FALTANTE!
        const cacheKey = `malla_cache_${codigoActual}_${catalogo}`;

        // 4. CACHÉ
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

        // 5. API (Enviamos Código + Catálogo)
        // Tu servicio getMalla debe recibir (token, codigo, catalogo)
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