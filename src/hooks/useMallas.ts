import { useEffect, useState } from "react";
import type { Malla } from "../types/mallas";
import { getMalla } from "../api/services/mallasService";
import { useAuth } from "../context/AuthContext";

export const useMallas = () => {
  const { token, user } = useAuth();
  const [mallas, setMallas] = useState<Malla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay datos de usuario, no hacemos nada
    if (!token || !user) return;

    const fetchData = async () => {
      // Obtenemos los identificadores únicos para crear la llave del caché
      const carrera = user.carreras[0];
      const cacheKey = `malla_cache_${carrera.codigo}_${carrera.catalogo}`;

      try {
        setLoading(true);

        // 1. INTENTO DE CARGAR DESDE CACHÉ (LocalStorage)
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          // Si existe en memoria, parseamos y guardamos en el estado
          const parsedMalla = JSON.parse(cachedData);
          
          // Verificación extra: asegurarnos que sea un array válido
          if (Array.isArray(parsedMalla) && parsedMalla.length > 0) {
            setMallas(parsedMalla);
            setLoading(false);
            console.log("Malla cargada desde caché ⚡");
            return; // ¡Importante! Salimos aquí para no llamar a la API
          }
        }

        // 2. SI NO HAY CACHÉ, LLAMAMOS A LA API
        console.log("Descargando malla desde API... 🌐");
        const data = await getMalla(token, carrera.codigo, carrera.catalogo);

        // 3. GUARDAMOS EN CACHÉ PARA LA PRÓXIMA VEZ
        // Solo guardamos si la data es válida
        if (data && data.length > 0) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }

        setMallas(data);
        setError(null);

      } catch (err) {
        console.error(err);
        setError("Error al cargar la malla curricular");
        
        // Si falló la API, podríamos intentar borrar un caché corrupto por si acaso
        localStorage.removeItem(cacheKey);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  return { mallas, loading, error };
};