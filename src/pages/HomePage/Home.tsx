import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p>No se encontró información del estudiante.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Bienvenido, {user.rut}
      </h1>

      <h2 className="text-2xl font-semibold mb-3 text-gray-700">
        Tus Carreras
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {user.carreras.map((carrera) => (
          <div
            key={carrera.codigo}
            className="border border-gray-200 rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/carrera/${carrera.codigo}`)}
          >
            <h3 className="text-xl font-semibold text-gray-800">{carrera.nombre}</h3>
            <p className="text-gray-600">Código: {carrera.codigo}</p>
            <p className="text-gray-600">Catálogo: {carrera.catalogo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
