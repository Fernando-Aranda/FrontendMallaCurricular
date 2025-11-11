import ProgressCircle from "./ProgressCircle"

interface SidebarAvanceProps {
  filter: string
  setFilter: (f: string) => void
  progressPercentage: number
  creditosAprobados: number
  totalCreditos: number
  aprobados: number
  reprobados: number
}

const SidebarAvance = ({
  filter,
  setFilter,
  progressPercentage,
  creditosAprobados,
  totalCreditos,
  aprobados,
  reprobados,
}: SidebarAvanceProps) => (
  <div className="w-80 p-8 border-l border-gray-200 bg-white">
    <div className="sticky top-8 space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-4 text-slate-800">Filtros</h2>
        {["TODOS", "APROBADO", "INSCRITO", "REPROBADO"].map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`w-full mb-2 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
              filter === opt ? "bg-blue-500" : "bg-slate-500 hover:bg-slate-600"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4 text-slate-800">Progreso</h2>
        
        <div className="flex justify-center">
          <ProgressCircle percentage={progressPercentage} />
        </div>
        
        <div className="p-4 mt-4 rounded-lg text-center bg-slate-600 text-white">
          <p className="text-sm mb-1">Créditos Aprobados</p>
          <p className="text-2xl font-bold">
            {creditosAprobados} / {totalCreditos}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="p-3 rounded-lg flex justify-between items-center bg-green-100">
          <span className="text-sm font-semibold text-green-800">Aprobados</span>
          <span className="text-lg font-bold text-green-800">{aprobados}</span>
        </div>
        <div className="p-3 rounded-lg flex justify-between items-center bg-red-100">
          <span className="text-sm font-semibold text-red-800">Reprobados</span>
          <span className="text-lg font-bold text-red-800">{reprobados}</span>
        </div>
      </div>
    </div>
  </div>
)

export default SidebarAvance