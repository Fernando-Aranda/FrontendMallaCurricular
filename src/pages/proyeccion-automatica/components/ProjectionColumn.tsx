import ProjectionCard from "./ProjectionCard"

interface ProjectionColumnProps {
  data: {
    periodo: string
    semestreRelativo: number
    totalCreditos: number
    asignaturas: any[]
  }
}

const ProjectionColumn = ({ data }: ProjectionColumnProps) => (
  <div className="flex flex-col h-full overflow-hidden bg-slate-50 rounded-xl border border-slate-200">
    {/* Encabezado */}
    <div className="bg-slate-800 p-3 text-center flex-shrink-0">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
        Periodo
      </p>
      <p className="text-lg font-bold text-white leading-none">
        {data.periodo}
      </p>
    </div>

    {/* Sub-header de créditos */}
    <div className="bg-purple-100 p-1.5 text-center border-b border-purple-200 flex-shrink-0">
      <p className="text-[10px] font-bold text-purple-800">
        CARGA: {data.totalCreditos} / 30 CR
      </p>
    </div>

    {/* Lista de Ramos con Scroll */}
    <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-300">
      {data.asignaturas.map((ramo) => (
        <ProjectionCard key={ramo.codigoRamo} course={ramo} />
      ))}
      
      {data.asignaturas.length === 0 && (
        <div className="h-full flex items-center justify-center opacity-50">
          <p className="text-xs text-center">Sin asignaturas</p>
        </div>
      )}
    </div>
  </div>
)

export default ProjectionColumn 