import { BookOpen, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

interface Estadisticas {
  totalAsignaturas: number;
  totalAprobadas: number;
  totalReprobadas: number;
  totalInscritas: number;
}

interface Props {
  stats: Estadisticas;
}

export const StatsCards = ({ stats }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {/* Total Asignaturas */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 text-slate-500 mb-2 text-sm font-medium">
          <BookOpen className="w-4 h-4" /> Total
        </div>
        <p className="text-3xl font-bold text-slate-800">{stats.totalAsignaturas}</p>
        <p className="text-xs text-slate-400 mt-1">Asignaturas cursadas</p>
      </div>

      {/* Aprobadas */}
      <div className="bg-emerald-50 p-5 rounded-xl shadow-sm border border-emerald-100">
        <div className="flex items-center gap-2 text-emerald-700 mb-2 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" /> Aprobadas
        </div>
        <p className="text-3xl font-bold text-emerald-800">{stats.totalAprobadas}</p>
        <p className="text-xs text-emerald-600 mt-1">
          {((stats.totalAprobadas / stats.totalAsignaturas) * 100 || 0).toFixed(0)}% Eficiencia
        </p>
      </div>

      {/* Reprobadas */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 text-red-600 mb-2 text-sm font-medium">
          <XCircle className="w-4 h-4" /> Reprobadas
        </div>
        <p className="text-3xl font-bold text-slate-800">{stats.totalReprobadas}</p>
        <p className="text-xs text-slate-400 mt-1">Intentos fallidos</p>
      </div>

      {/* En Curso */}
      <div className="bg-blue-50 p-5 rounded-xl shadow-sm border border-blue-100">
        <div className="flex items-center gap-2 text-blue-700 mb-2 text-sm font-medium">
          <TrendingUp className="w-4 h-4" /> En Curso
        </div>
        <p className="text-3xl font-bold text-blue-800">{stats.totalInscritas}</p>
        <p className="text-xs text-blue-600 mt-1">Semestre actual</p>
      </div>
    </div>
  );
};