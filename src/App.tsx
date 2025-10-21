// src/App.tsx

import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import MallasPage from './pages/mallas/MallasPage';
import AvancePage from './pages/avance/AvancePage'; // <-- 1. IMPORTAMOS LA NUEVA PÁGINA

// --- Navbar Component ---
const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="font-bold text-xl">App Mallas UCN</Link>
        {/* // <-- 2. AÑADIMOS ENLACES DE NAVEGACIÓN --> */}
        <div className="flex items-center gap-4">
          <Link to="/mallas" className="hover:text-orange-400">Malla</Link>
          <Link to="/avance" className="hover:text-orange-400">Avance</Link>
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
        <p>
          Tu primera carrera es: {" "}
          {user?.carreras[0]?.nombre} ({user?.carreras[0]?.codigo})
        </p>
        
        {/* // <-- 3. AÑADIMOS ENLACES VISUALES EN EL DASHBOARD --> */}
        <div className="mt-8 flex gap-4">
          <Link
            to="/mallas"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
          >
            Ver Malla Curricular
          </Link>
          <Link
            to="/avance"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
          >
            Ver Avance Curricular
          </Link>
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
        <Route path="/mallas" element={<MallasPage />} />
        
        {/* // <-- 4. AQUÍ ESTÁ LA NUEVA RUTA PROTEGIDA --> */}
        <Route path="/avance" element={<AvancePage />} />
        
        {/* Agrega más rutas protegidas aquí */}
      </Route>

      <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
    </Routes>
  );
}

export default App;