"use client"

import { useParams } from "react-router-dom"
import NavigationUcn from "../../components/NavigationUcn"
import { useHistorial } from "./hooks/useHistorial"
import { CheckCircle2, XCircle, Clock, BookOpen, TrendingUp } from "lucide-react"

const HistorialPage = () => {
  const { codigoCarrera } = useParams<{ codigoCarrera: string }>()
  const { historial, loading, error } = useHistorial(codigoCarrera)

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <NavigationUcn codigoCarrera={codigoCarrera} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Cargando historial...</p>
          </div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <NavigationUcn codigoCarrera={codigoCarrera} />
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="border border-red-200 bg-red-50 rounded-lg p-6">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        </div>
      </div>
    )

  if (!historial)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <NavigationUcn codigoCarrera={codigoCarrera} />
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="border border-slate-200 bg-white rounded-lg p-6">
            <p className="text-slate-500 text-center">No se encontró información del historial.</p>
          </div>
        </div>
      </div>
    )

  const periodosOrdenados = Object.keys(historial).sort()

  const calcularEstadisticas = () => {
    let totalAsignaturas = 0
    let totalAprobadas = 0
    let totalReprobadas = 0
    let totalInscritas = 0

    Object.values(historial).forEach((asignaturas) => {
      asignaturas.forEach((asignatura) => {
        totalAsignaturas++
        if (asignatura.estado === "APROBADO") totalAprobadas++
        else if (asignatura.estado === "REPROBADO") totalReprobadas++
        else if (asignatura.estado === "INSCRITO") totalInscritas++
      })
    })

    return { totalAsignaturas, totalAprobadas, totalReprobadas, totalInscritas }
  }

  const estadisticas = calcularEstadisticas()

  const calcularEstadisticasPeriodo = (asignaturas: any[]) => {
    const aprobadas = asignaturas.filter((a) => a.estado === "APROBADO").length
    const reprobadas = asignaturas.filter((a) => a.estado === "REPROBADO").length
    const inscritas = asignaturas.filter((a) => a.estado === "INSCRITO").length
    return { aprobadas, reprobadas, inscritas, total: asignaturas.length }
  }

  const EstadoBadge = ({ estado }: { estado: string }) => {
    if (estado === "APROBADO") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          Aprobado
        </span>
      )
    } else if (estado === "REPROBADO") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
          <XCircle className="w-3 h-3" />
          Reprobado
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
          <Clock className="w-3 h-3" />
          Inscrito
        </span>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <NavigationUcn codigoCarrera={codigoCarrera} />

      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Historial Académico</h1>
          <p className="text-slate-600 text-lg">Resumen completo de tu trayectoria académica</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Asignaturas */}
          <div className="border border-slate-200 bg-white/80 backdrop-blur rounded-lg shadow-sm">
            <div className="p-4 pb-2">
              <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Total Asignaturas
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="text-3xl font-bold text-slate-900">{estadisticas.totalAsignaturas}</div>
            </div>
          </div>

          {/* Aprobadas */}
          <div className="border border-emerald-200 bg-emerald-50/80 backdrop-blur rounded-lg shadow-sm">
            <div className="p-4 pb-2">
              <div className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Aprobadas
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="text-3xl font-bold text-emerald-700">{estadisticas.totalAprobadas}</div>
              <p className="text-xs text-emerald-600 mt-1">
                {((estadisticas.totalAprobadas / estadisticas.totalAsignaturas) * 100).toFixed(1)}% del total
              </p>
            </div>
          </div>

          {/* Reprobadas */}
          <div className="border border-red-200 bg-red-50/80 backdrop-blur rounded-lg shadow-sm">
            <div className="p-4 pb-2">
              <div className="text-sm font-medium text-red-700 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Reprobadas
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="text-3xl font-bold text-red-700">{estadisticas.totalReprobadas}</div>
              <p className="text-xs text-red-600 mt-1">
                {((estadisticas.totalReprobadas / estadisticas.totalAsignaturas) * 100).toFixed(1)}% del total
              </p>
            </div>
          </div>

          {/* En Curso */}
          <div className="border border-blue-200 bg-blue-50/80 backdrop-blur rounded-lg shadow-sm">
            <div className="p-4 pb-2">
              <div className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                En Curso
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="text-3xl font-bold text-blue-700">{estadisticas.totalInscritas}</div>
              <p className="text-xs text-blue-600 mt-1">Asignaturas actuales</p>
            </div>
          </div>
        </div>

        {/* Periods List */}
        <div className="space-y-6">
          {periodosOrdenados.map((periodo) => {
            const stats = calcularEstadisticasPeriodo(historial[periodo])
            return (
              <div
                key={periodo}
                className="border border-slate-200 bg-white/90 backdrop-blur rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="border-b border-slate-100 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Periodo {periodo}</h2>
                      <p className="text-sm text-slate-600 mt-1">{stats.total} asignaturas en este periodo</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {stats.aprobadas > 0 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {stats.aprobadas} aprobadas
                        </span>
                      )}
                      {stats.reprobadas > 0 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          {stats.reprobadas} reprobadas
                        </span>
                      )}
                      {stats.inscritas > 0 && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {stats.inscritas} en curso
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Content - Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">Código</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">NRC</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">Tipo</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">Estado</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-700">Excluido</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {historial[periodo].map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <span className="font-mono text-sm font-medium text-slate-900">{r.codigo}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-slate-600">{r.nrc}</span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              {r.tipo}
                            </span>
                          </td>
                          <td className="p-4">
                            <EstadoBadge estado={r.estado} />
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-slate-600">{r.excluido ? "Sí" : "No"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HistorialPage
