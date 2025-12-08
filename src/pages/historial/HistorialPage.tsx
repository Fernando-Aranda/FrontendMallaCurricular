"use client"

import { useMemo } from "react"
import { useParams } from "react-router-dom"
import NavigationUcn from "../../components/NavigationUcn"
import { useHistorial } from "./hooks/useHistorial"
import { BookOpen, AlertCircle } from "lucide-react"

// Importamos nuestros componentes nuevos
import { StatsCards } from "./components/StatsCards"
import { PeriodoItem } from "./components/PeriodoItem"

const HistorialPage = () => {
  const { codigoCarrera } = useParams<{ codigoCarrera: string }>()
  const { historial, loading, error } = useHistorial(codigoCarrera)

  // 1. CÁLCULO DE ESTADÍSTICAS
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

  // 2. ORDENAMIENTO (Antiguo -> Reciente)
  // Simplemente .sort() ordena strings ascendentemente ("2020", "2021", "2022")
  const periodosOrdenados = useMemo(() => {
    return historial ? Object.keys(historial).sort() : [];
  }, [historial]);


  // --- ESTADOS DE CARGA/ERROR ---
  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavigationUcn codigoCarrera={codigoCarrera} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mb-4"></div>
          <p className="text-slate-500 font-medium">Cargando historial...</p>
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
        
        {/* Header de Página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Historial Académico</h1>
          <p className="text-slate-500 mt-1">
            Visualizando trayectoria desde {formatearTextoPeriodo(periodosOrdenados[0])} hasta la actualidad.
          </p>
        </div>

        {/* Tarjetas de Estadísticas */}
        <StatsCards stats={estadisticas} />

        {/* Línea de Tiempo */}
        <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-10 pl-8 md:pl-10 pb-8">
          {periodosOrdenados.map((periodo, index) => {
            const isLast = index === periodosOrdenados.length - 1;
            return (
              <PeriodoItem 
                key={periodo} 
                periodo={periodo} 
                asignaturas={historial[periodo]} 
                isLast={isLast}
              />
            );
          })}
        </div>

      </main>
    </div>
  )
}

// Helper simple para el texto del header
function formatearTextoPeriodo(periodo: string) {
  if (!periodo) return "...";
  const year = periodo.slice(0, 4);
  const sem = periodo.slice(4, 6);
  return sem === "10" ? `Inicio ${year}` : `Mitad ${year}`;
}

export default HistorialPage