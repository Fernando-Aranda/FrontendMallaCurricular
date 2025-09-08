// src/App.tsx

import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// --- Navbar Component ---
// Este es el Navbar que solo usaremos en las páginas que lo necesiten.
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 text-white p-4 flex justify-between items-center">
      <Link to="/dashboard" className="font-bold text-xl">App Mallas UCN</Link>
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
      <Navbar /> {/* <-- El Navbar se incluye AQUÍ, solo para esta página */}
      <main className="p-8">
        <h1 className="text-3xl font-bold">Bienvenido al Dashboard, {user?.name}!</h1>
        <p>Tu email es: {user?.email}</p>
      </main>
    </>
  );
};

// Página de inicio pública, SIN navbar.
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
    // App.tsx ahora solo se encarga de definir las rutas. Simple y limpio.
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomePage />} />

      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
    </Routes>
  );
}

export default App;