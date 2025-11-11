import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import MallasPage from "../pages/mallas/MallasPage";
import AvancePage from "../pages/avance/AvancePage";
import Home from "../pages/home-page/Home";
import CrearProyeccion from "../pages/crear-proyeccion/CrearProyeccion";
import VerProyecciones from "../pages/ver-proyecciones/VerProyecciones";
import VerProyeccionDetalle from "../pages/ver-proyecciones-detalle/VerProyeccionDetalle";

// --- Componente Principal App ---
function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        
        {/* El resto de las rutas se mantienen igual */}
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