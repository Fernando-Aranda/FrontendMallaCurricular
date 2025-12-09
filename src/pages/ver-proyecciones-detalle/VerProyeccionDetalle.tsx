import { useMemo } from "react"; 
import { Link } from "react-router-dom";
import NavigationUcn from "../../components/NavigationUcn";
import { useVerProyeccionDetalle } from "./hooks/useVerProyeccionDetalle";
import { useMallas } from "../../hooks/useMallas";
import DetalleHeader from "./components/DetalleHeader";
import SemestreCard from "./components/SemestreCard";
import InfoProyeccion from "./components/InfoProyeccion";

const VerProyeccionDetalle = () => {
  const { loading: loadingProyeccion, error, proyeccion, ramosPorSemestre } = useVerProyeccionDetalle();
  const codigoCarrera = proyeccion?.codigoCarrera;
  const { mallas, loading: loadingMallas } = useMallas(codigoCarrera);
  const nombresMap = useMemo(() => {
    const map = new Map<string, string>();
    if (mallas) {
      mallas.forEach((ramo) => {
        map.set(ramo.codigo, ramo.asignatura);
      });
    }
    return map;
  }, [mallas]);

  const loading = loadingProyeccion || (!!codigoCarrera && loadingMallas);

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
        <NavigationUcn /> 
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md w-full">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Error de Carga</h2>
            <p className="text-slate-500 mb-6">{error || "No pudimos encontrar la proyección solicitada."}</p>
            <Link to="/home" className="block w-full bg-slate-800 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-slate-700 transition-colors">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const semestresOrdenados = Object.keys(ramosPorSemestre).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <NavigationUcn codigoCarrera={proyeccion.codigoCarrera} />

      <DetalleHeader 
        nombreProyeccion={proyeccion.nombre} 
        codigoCarrera={proyeccion.codigoCarrera}
      />

      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        <InfoProyeccion proyeccion={proyeccion} />

        <div className="mt-8 space-y-2">
          {semestresOrdenados.length > 0 ? (
            semestresOrdenados.map((semestre, index) => (
              <SemestreCard 
                key={semestre} 
                semestre={semestre} 
                ramos={ramosPorSemestre[Number(semestre)]}
                nombresMap={nombresMap}
                isLast={index === semestresOrdenados.length - 1} 
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