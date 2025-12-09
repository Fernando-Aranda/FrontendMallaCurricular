import { Link } from "react-router-dom";
import NavigationUcn from "../../components/NavigationUcn";
import { useVerProyeccionDetalle } from "./hooks/useVerProyeccionDetalle";

// Componentes de presentación
import DetalleHeader from "./components/DetalleHeader";
import SemestreCard from "./components/SemestreCard";
import InfoProyeccion from "./components/InfoProyeccion";

const VerProyeccionDetalle = () => {
  const { loading, error, proyeccion, ramosPorSemestre } = useVerProyeccionDetalle();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
          <p className="text-slate-500 font-medium">Cargando planificación...</p>
        </div>
      </div>
    );
  }

  if (error || !proyeccion) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Renderizamos navegación aunque falle para que pueda salir */}
        <NavigationUcn /> 
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Error de Carga</h2>
            <p className="text-slate-500 mb-6">{error || "No pudimos encontrar la proyección solicitada."}</p>
            <Link
              to="/home"
              className="block w-full bg-slate-800 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-slate-700 transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Ordenamos los semestres numéricamente para asegurar orden correcto en la línea de tiempo
  const semestresOrdenados = Object.keys(ramosPorSemestre).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <NavigationUcn codigoCarrera={proyeccion.codigoCarrera} />

      <DetalleHeader 
        nombreProyeccion={proyeccion.nombre} 
        codigoCarrera={proyeccion.codigoCarrera}
        // fechaCreacion={proyeccion.fechaCreacion} // Si agregas fecha a tu interfaz Proyeccion, descomenta esto
      />

      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* Tarjeta de Resumen Superior */}
        <InfoProyeccion proyeccion={proyeccion} />

        {/* Contenedor de la Línea de Tiempo */}
        <div className="mt-8 space-y-2">
          {semestresOrdenados.length > 0 ? (
            semestresOrdenados.map((semestre, index) => (
              <SemestreCard 
                key={semestre} 
                semestre={semestre} 
                ramos={ramosPorSemestre[Number(semestre)]} 
                isLast={index === semestresOrdenados.length - 1} // Para cortar la línea al final
              />
            ))
          ) : (
            <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-xl text-slate-400">
              <p>Esta proyección no tiene asignaturas.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerProyeccionDetalle;