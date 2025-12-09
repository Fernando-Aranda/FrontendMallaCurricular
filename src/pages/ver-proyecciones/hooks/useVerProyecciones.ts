import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

export interface Proyeccion {
  id: number;
  nombre: string;
  rut: string;
  codigoCarrera: string;
  fechaCreacion: string;
  ramos: [...any];
}

export const useVerProyecciones = () => {
  const { user, token } = useAuth();
  const { codigoCarrera: codigo } = useParams<{ codigoCarrera: string }>();
  const navigate = useNavigate();

  const [proyecciones, setProyecciones] = useState<Proyeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProyecciones = async () => {
      if (!user || !token || !codigo) return;
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Proyeccion[]>(
          `http://localhost:3000/proyecciones/usuario/${user.rut}/${codigo}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const filtradas = response.data.filter((p) => p.codigoCarrera === codigo);
        setProyecciones(filtradas);
      } catch (err) {
        console.error("Error al obtener proyecciones:", err);
        setError("No se pudieron cargar las proyecciones.");
      } finally {
        setLoading(false);
      }
    };
    fetchProyecciones();
  }, [user, token, codigo]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta proyección?")) return;
    try {
      await axios.delete(`http://localhost:3000/proyecciones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProyecciones((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error al eliminar proyección:", err);
      alert("No se pudo eliminar la proyección.");
    }
  };

  return {
    loading,
    error,
    proyecciones,
    codigo,
    handleDelete,
    navigate,
  };
};