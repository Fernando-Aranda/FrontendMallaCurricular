"use client"

import { useMemo } from "react"
import { useParams } from "react-router-dom"
import NavigationUcn from "../../components/NavigationUcn"
import { useHistorial } from "./hooks/useHistorial"
import { useMallas } from "../../hooks/useMallas" // Importamos el hook de mallas
import { BookOpen, AlertCircle } from "lucide-react"

// Importamos nuestros componentes nuevos
import { StatsCards } from "./components/StatsCards"
import { PeriodoItem } from "./components/PeriodoItem"

const HistorialPage = () => {
  const { codigoCarrera } = useParams<{ codigoCarrera: string }>()
  
  // 1. Obtenemos el historial (Datos del alumno)
  const { historial, loading: loadingHistorial, error: errorHistorial } = useHistorial(codigoCarrera)
  
  // 2. Obtenemos la malla (Para saber los nombres de los ramos)
  const { mallas, loading: loadingMallas } = useMallas(codigoCarrera)

  // 3. Creamos un mapa rápido Código -> Nombre
  const nombresMap = useMemo(() => {
    const map = new Map<string, string>()
    if (mallas) {
      mallas.forEach((ramo) => {
        map.set(ramo.codigo, ramo.asignatura)
      })
    }
    return map
  }, [mallas])

  const loading = loadingHistorial || loadingMallas
  const error = errorHistorial

  // 4. CÁLCULO DE ESTADÍSTICAS
  const estadisticas = useMemo(() => {
    let totalAsignaturas = 0;
    let totalAprobadas = 0;
    let totalReprobadas = 0;
    let totalInscritas = 0;

    if (historial) {
      Object.values(historial).forEach((asignaturas) => {
        asignaturas.forEach((asignatura) => {
          totalAsignaturas++;
          if (asignatura.estado === "APROBADO") totalAprobadas++;
          else if (asignatura.estado === "REPROBADO") totalReprobadas++;
          else if (asignatura.estado === "INSCRITO") totalInscritas++;
        });
      });
    }
    return { totalAsignaturas, totalAprobadas, totalReprobadas, totalInscritas };
  }, [historial]);

  const periodosOrdenados = useMemo(() => {
    // Ordenamos descendente (más nuevo arriba) para que sea más útil
    return historial ? Object.keys(historial).sort().reverse() : [];
  }, [historial]);


  // --- ESTADOS DE CARGA/ERROR ---
  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavigationUcn codigoCarrera={codigoCarrera} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mb-4"></div>
          <p className="text-slate-500 font-medium">Cargando historial completo...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-slate-50">
        <NavigationUcn codigoCarrera={codigoCarrera} />
        <div className="flex flex-col items-center justify-center h-[80vh] p-4">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center max-w-md">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Error</h2>
            <p className="text-slate-500">{error}</p>
          </div>
        </div>
      </div>
    )

  if (!historial || Object.keys(historial).length === 0)
    return (
      <div className="min-h-screen bg-slate-50">
        <NavigationUcn codigoCarrera={codigoCarrera} />
        <div className="flex flex-col items-center justify-center h-[80vh] p-4">
          <div className="bg-white p-12 rounded-xl shadow-sm border border-dashed border-slate-300 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Sin registros</h2>
            <p className="text-slate-500">No se encontró historial para esta carrera.</p>
          </div>
        </div>
      </div>
    )

  // --- RENDER PRINCIPAL ---
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <NavigationUcn codigoCarrera={codigoCarrera} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Historial Académico</h1>
          <p className="text-slate-500 mt-1">
            Visualizando trayectoria desde {formatearTextoPeriodo(periodosOrdenados[periodosOrdenados.length - 1])} hasta la actualidad.
          </p>
        </div>

        <StatsCards stats={estadisticas} />

        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-10 pl-8 md:pl-10 pb-8">
          {periodosOrdenados.map((periodo, index) => {
            const isLast = index === periodosOrdenados.length - 1;
            return (
              <PeriodoItem 
                key={periodo} 
                periodo={periodo} 
                asignaturas={historial[periodo]} 
                nombresMap={nombresMap} // Pasamos el mapa de nombres
                isLast={isLast}
              />
            );
          })}
        </div>

      </main>
    </div>
  )
}

function formatearTextoPeriodo(periodo: string) {
  if (!periodo) return "...";
  const year = periodo.slice(0, 4);
  const sem = periodo.slice(4, 6);
  return sem === "10" ? `Inicio ${year}` : `Mitad ${year}`;
}

export default HistorialPage