import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

interface Proyeccion {
  id: number;
  nombre: string;
  rut: string;
  codigoCarrera: string;
  fechaCreacion: string;
}

const VerProyecciones: React.FC = () => {
  const { user, token } = useAuth();
  const { codigoCarrera } = useParams<{ codigoCarrera: string }>(); // carrera seleccionada
  const navigate = useNavigate();

  const [proyecciones, setProyecciones] = useState<Proyeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar proyecciones del usuario filtradas por carrera
  useEffect(() => {
    const fetchProyecciones = async () => {
      if (!user || !token || !codigoCarrera) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<Proyeccion[]>(
          `http://localhost:3000/proyecciones/usuario/${user.rut}/${codigoCarrera}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Datos recibidos del backend:", response.data);
        console.log("Codigo carrera actual:", codigoCarrera);
        // 🔸 Filtrar solo las proyecciones de la carrera actual
        const filtradas = response.data.filter(
          (p) => p.codigoCarrera === codigoCarrera
        );
        setProyecciones(filtradas);
      } catch (err) {
        console.error("Error al obtener proyecciones:", err);
        setError("No se pudieron cargar las proyecciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchProyecciones();
  }, [user, token, codigoCarrera]);

  // 🔹 Eliminar proyección
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

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600">
        Cargando tus proyecciones...
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        {error}
        <div className="mt-4">
          <Link
            to="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Mis Proyecciones — {codigoCarrera}
        </h1>
        <Link
          to={`/crear-proyeccion/${codigoCarrera}`}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          + Nueva Proyección
        </Link>
      </div>

      {proyecciones.length === 0 ? (
        <div className="text-gray-600 text-center mt-12">
          No tienes proyecciones registradas para esta carrera.
          <div className="mt-4">
            <Link
              to={`/crear-proyeccion/${codigoCarrera}`}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Crear mi primera proyección
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyecciones.map((proyeccion) => (
            <div
              key={proyeccion.id}
              className="bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {proyeccion.nombre}
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Creada el:{" "}
                {new Date(proyeccion.fechaCreacion).toLocaleDateString("es-CL")}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/proyeccion/${proyeccion.id}`)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  Ver Detalle
                </button>

                <button
                  onClick={() => handleDelete(proyeccion.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/dashboard"
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          ← Volver al Dashboard
        </Link>
      </div>
    </div>
  );
};

export default VerProyecciones;
