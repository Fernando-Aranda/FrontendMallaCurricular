interface CourseCardAvanceProps {
  course: {
    courseCode: string
    courseName: string
    credits: number
    currentStatus: string
    failedCount: number
    latestPeriod: string | null
  }
}

const getStatusClasses = (status: string): string => {
  switch (status) {
    case "APROBADO":
      return "bg-green-50 border-green-400 text-slate-800 border-l-2"
    case "INSCRITO":
      return "bg-blue-50 border-blue-400 text-slate-800 border-l-2"
    case "REPROBADO":
      return "bg-red-50 border-red-400 text-slate-800 border-l-2"
    case "PENDIENTE":
    default:
      return "bg-white border-slate-200 text-slate-400 border border-dashed opacity-80"
  }
}

const CourseCardAvance = ({ course }: CourseCardAvanceProps) => {
  // Función auxiliar para cortar nombres muy largos si es necesario
  const shortName = course.courseName.length > 35 
    ? course.courseName.substring(0, 32) + "..." 
    : course.courseName;

  return (
    <div
      className={`p-2 rounded shadow-sm transition-all hover:shadow-md relative group w-full ${getStatusClasses(
        course.currentStatus
      )}`}
    >
      {/* Código y Estado */}
      <div className="flex flex-wrap justify-between items-start mb-1 gap-1">
        <span className="font-bold text-[9px] uppercase opacity-60">
          {course.courseCode}
        </span>
        {course.failedCount > 0 && (
          <span className="text-[9px] font-bold text-white bg-red-500 px-1 rounded-sm">
            x{course.failedCount}
          </span>
        )}
      </div>

      {/* Nombre Asignatura */}
      <p 
        className={`text-[10px] md:text-xs font-bold leading-tight mb-1.5 break-words ${
          course.currentStatus === 'PENDIENTE' ? 'font-normal' : ''
        }`}
        title={course.courseName} // Tooltip nativo al pasar el mouse
      >
        {shortName}
      </p>

      {/* Footer Tarjeta: Periodo y Créditos */}
      {course.currentStatus !== 'PENDIENTE' && (
        <div className="flex justify-between items-end border-t border-black/5 pt-1 mt-auto">
          <span className="text-[9px] opacity-70 font-medium truncate max-w-[60%]">
            {course.latestPeriod || '-'}
          </span>
          <span className="text-[9px] font-bold opacity-80">
            {course.credits} cr
          </span>
        </div>
      )}
    </div>
  )
}

export default CourseCardAvance