interface ProjectionCardProps {
  course: {
    codigoRamo: string
    nombreAsignatura: string
    creditos: number
  }
}

const ProjectionCard = ({ course }: ProjectionCardProps) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-1">
      <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-1.5 py-0.5 rounded">
        {course.codigoRamo}
      </span>
      <span className="text-[10px] font-bold text-slate-400">
        {course.creditos} Cr.
      </span>
    </div>
    
    <p className="text-xs font-bold text-slate-700 leading-tight">
      {course.nombreAsignatura}
    </p>
  </div>
)

export default ProjectionCard