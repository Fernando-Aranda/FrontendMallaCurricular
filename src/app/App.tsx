import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import MallasPage from "../pages/mallas/MallasPage";
import AvancePage from "../pages/avance/AvancePage";
import Home from "../pages/home-page/Home";
import CrearProyeccion from "../pages/crear-proyeccion/CrearProyeccion";
import VerProyecciones from "../pages/ver-proyecciones/VerProyecciones";
import VerProyeccionDetalle from "../pages/ver-proyecciones-detalle/VerProyeccionDetalle";
import HistorialPage from "../pages/historial/HistorialPage";
// Importamos la nueva página de Proyección Automática
import ProyeccionPage from "../pages/proyeccion-automatica/ProyeccionPage";

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

        <Route path="/malla/:codigoCarrera" element={<MallasPage />} />
        <Route path="/avance/:codigoCarrera" element={<AvancePage />} />
        <Route path="/historial/:codigoCarrera" element={<HistorialPage />} />
        <Route path="/crear-proyeccion/:codigoCarrera" element={<CrearProyeccion />} />
        <Route path="/ver-proyecciones/:codigoCarrera" element={<VerProyecciones />} />
        <Route path="/proyeccion-automatica/:codigoCarrera" element={<ProyeccionPage />} />
        <Route path="/proyeccion/:id" element={<VerProyeccionDetalle />} />
        
      </Route>

      {/* 404 */}
      <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
    </Routes>
  );
}

export default App;