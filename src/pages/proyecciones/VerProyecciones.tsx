import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
// 1. IMPORTAMOS EL NUEVO COMPONENTE DE NAVEGACIÓN
import NavigationUcn from "../../components/NavigationUcn";

interface Proyeccion {
  id: number;
  nombre: string;
  rut: string;
  codigoCarrera: string;
  fechaCreacion: string;
}

const VerProyecciones: React.FC = () => {
  const { user, token } = useAuth();
  // Renombramos el parámetro para consistencia, aunque no es estrictamente necesario
  const { codigoCarrera: codigo } = useParams<{ codigoCarrera: string }>();
  const navigate = useNavigate();

  const [proyecciones, setProyecciones] = useState<Proyeccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- LÓGICA DE DATOS (SIN CAMBIOS) ---
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

  // 2. ESTADOS DE CARGA Y ERROR MEJORADOS CON NAVEGACIÓN
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn codigoCarrera={codigo} />
        <div className="p-8 text-center text-gray-600">
          Cargando tus proyecciones...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationUcn codigoCarrera={codigo} />
        <div className="p-8 text-center text-red-500">
          {error}
          <div className="mt-4">
            <Link to="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. APLICAMOS EL ESTILO CONSISTENTE Y EL NAVEGADOR
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationUcn codigoCarrera={codigo} />

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Mis Proyecciones — {codigo}
          </h1>
          <Link
            to={`/crear-proyeccion/${codigo}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            + Nueva Proyección
          </Link>
        </div>

        {proyecciones.length === 0 ? (
          <div className="text-gray-600 text-center mt-12 bg-white p-12 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-slate-700">Aún no tienes proyecciones</h2>
            <p className="mt-2">¡Planifica tu futuro académico ahora!</p>
            <div className="mt-6">
              <Link
                to={`/crear-proyeccion/${codigo}`}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
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
                className="bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    {proyeccion.nombre}
                  </h2>
                  <p className="text-slate-600 text-sm mt-2">
                    Creada el:{" "}
                    {new Date(proyeccion.fechaCreacion).toLocaleDateString("es-CL")}
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/proyeccion/${proyeccion.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    Ver Detalle
                  </button>
                  <button
                    onClick={() => handleDelete(proyeccion.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link to="/dashboard" className="text-blue-500 hover:underline">
            ← Volver al Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
};

export default VerProyecciones;