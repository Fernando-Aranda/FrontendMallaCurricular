// src/pages/HomePage/Home.tsx
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
// 1. Importamos el nuevo navegador reutilizable
import NavigationUcn from "../../components/NavigationUcn";

// 2. El componente ahora se llama Home y se exporta por defecto
const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 3. Reemplazamos el antiguo <Navbar /> por <NavigationUcn /> */}
      {/* No pasamos 'codigoCarrera' porque esta es una página general */}
      <NavigationUcn />

      <main className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800">
          Bienvenido al Dashboard, {user?.rut}!
        </h1>
        <p className="mt-2 text-slate-600">
          Selecciona una de tus carreras para ver su información:
        </p>

        <div className="mt-8 space-y-4">
          {user?.carreras.map((carrera) => (
            <div
              key={carrera.codigo}
              className="p-6 border rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold text-slate-800">
                {carrera.nombre} ({carrera.codigo})
              </h2>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link
                  to={`/malla/${carrera.codigo}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Ver Malla
                </Link>
                <Link
                  to={`/avance/${carrera.codigo}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Ver Avance
                </Link>
                <Link
                  to={`/crear-proyeccion/${carrera.codigo}`}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Crear Proyección
                </Link>
                <Link
                  to={`/ver-proyecciones/${carrera.codigo}`}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                  Mis Proyecciones
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;