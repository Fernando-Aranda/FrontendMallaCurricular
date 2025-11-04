// src/App.tsx
import { Routes, Route, Link } from "react-router-dom";
// 1. Simplificamos los imports que ya no son necesarios aquí
import Login from "./pages/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import MallasPage from "./pages/mallas/MallasPage";
import AvancePage from "./pages/avance/AvancePage";
import CarreraPage from "./pages/carrerasPage/CarreraPage";
// El componente 'Home' ahora contiene la lógica del Dashboard
import Home from "./pages/HomePage/Home";
import CrearProyeccion from "./pages/proyecciones/CrearProyeccion";
import VerProyecciones from "./pages/proyecciones/VerProyecciones";
import VerProyeccionDetalle from "./pages/proyecciones/VerProyeccionDetalle";

// 2. Eliminamos las definiciones de 'Navbar' y 'Dashboard' de este archivo

// --- Página de Inicio Pública (sin sesión) ---
const HomePage = () => (
  <div className="p-8 text-center">
    <h1 className="text-3xl font-bold">Página de Inicio Pública</h1>
    <p className="mt-4">
      Cualquiera puede ver esta página.
      <Link to="/login" className="text-blue-500 underline ml-2">
        Inicia sesión
      </Link>
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
        {/* 3. La ruta '/dashboard' ahora apunta al componente 'Home' */}
        <Route path="/home" element={<Home />} />
        
        {/* El resto de las rutas se mantienen igual */}
        <Route path="/carrera/:codigo" element={<CarreraPage />} />
        <Route path="/malla/:codigo" element={<MallasPage />} />
        <Route path="/avance/:codigo" element={<AvancePage />} />
        <Route path="/crear-proyeccion/:codigo" element={<CrearProyeccion />} />
        <Route path="/ver-proyecciones/:codigoCarrera" element={<VerProyecciones />} />
        <Route path="/proyeccion/:id" element={<VerProyeccionDetalle />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
    </Routes>
  );
}

export default App;