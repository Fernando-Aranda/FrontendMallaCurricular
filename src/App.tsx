// src/App.tsx

import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import MallasPage from './pages/mallas/MallasPage';
import AvancePage from './pages/avance/AvancePage'; 
import CarreraPage from './pages/carrerasPage/CarreraPage';
import Home from './pages/HomePage/Home';

// --- Navbar Component ---
const Navbar = () => {
  const { user, logout } = useAuth(); // <-- CAMBIO: Obtenemos el usuario para los links
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="font-bold text-xl">App Mallas UCN</Link>
        <div className="flex items-center gap-4">
          {/* <-- CAMBIO: Links dinámicos que apuntan a la primera carrera del usuario --> */}
          {user && user.carreras.length > 0 && (
            <>
              <Link to={`/malla/${user.carreras[0].codigo}`} className="hover:text-orange-400">Malla</Link>
              <Link to={`/avance/${user.carreras[0].codigo}`} className="hover:text-orange-400">Avance</Link>
            </>
          )}
        </div>
      </div>
      <button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded">
        Cerrar Sesión
      </button>
    </nav>
  );
};

// --- Page Components ---

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main className="p-8">
        <h1 className="text-3xl font-bold">Bienvenido al Dashboard, {user?.rut}!</h1>
        <p className="mt-2">Selecciona una de tus carreras para ver su información:</p>
        
        {/* <-- CAMBIO PRINCIPAL: Generamos dinámicamente las opciones para cada carrera --> */}
        <div className="mt-8 space-y-4">
          {user?.carreras.map(carrera => (
            <div key={carrera.codigo} className="p-4 border rounded-lg shadow-sm bg-white">
              <h2 className="text-xl font-semibold">{carrera.nombre} ({carrera.codigo})</h2>
              <div className="mt-4 flex gap-4">
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
                  Ver Avance Curricular
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};
const HomePage = () => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold">Página de Inicio Pública</h1>
    <p className="mt-4">
      Cualquiera puede ver esta página.
      <Link to="/login" className="text-blue-500 underline ml-2">Inicia sesión</Link>
      para ver el dashboard.
    </p>
  </div>
);

// --- Componente Principal App ---
function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomePage />} />
      
      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/carrera/:codigo" element={<CarreraPage />} />
        
        {/* Rutas de Malla (sin cambios) */}
        <Route path="/malla/:codigo" element={<MallasPage />} />
        <Route path="/mallas" element={<MallasPage />} />
        
        {/* <-- CAMBIO: La ruta de avance ahora es dinámica --> */}
        <Route path="/avance/:codigo" element={<AvancePage />} />
        
      </Route>

      <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
    </Routes>
  );
}

export default App;