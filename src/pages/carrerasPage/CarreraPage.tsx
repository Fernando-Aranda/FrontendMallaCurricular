import { useParams, useNavigate } from "react-router-dom";

const CarreraPage = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">
        Selecciona una opción para la carrera {codigo}
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => navigate(`/malla/${codigo}`)}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
        >
          Ver Malla Curricular
        </button>
        <button
          onClick={() => navigate(`/avance/${codigo}`)}
          className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition"
        >
          Ver Avance Académico
        </button>
        <button
          onClick={() => navigate(`/crear-proyeccion/${codigo}`)}
          className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition"
        >
          Crear Proyección
        </button>
      </div>

      <p className="text-gray-600">
        Aquí puedes seleccionar qué acción deseas realizar con la carrera.
      </p>
    </div>
  );
};

export default CarreraPage;
