interface CourseCardAvanceProps {
  course: {
    courseCode: string
    courseName: string
    credits: number
    currentStatus: string
    failedCount: number
    latestPeriod: string
  }
}

const getStatusClasses = (status: string): string => {
  switch (status) {
    case "APROBADO":
      return "bg-green-100 text-slate-800"
    case "INSCRITO":
      return "bg-slate-500 text-white"
    case "REPROBADO":
      return "bg-red-500 text-white"
    default:
      return "bg-slate-400 text-white"
  }
}

const CourseCardAvance = ({ course }: CourseCardAvanceProps) => (
  <div
    className={`p-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg relative group ${getStatusClasses(course.currentStatus)}`}
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-bold text-sm">{course.courseCode}</h3>
      <span
        className={`text-xs px-2 py-1 rounded font-semibold ${
          course.currentStatus === "REPROBADO"
            ? "bg-white text-red-600"
            : "bg-slate-800 text-white"
        }`}
      >
        {course.currentStatus}
      </span>
    </div>
    <p className="text-sm mb-2 font-medium">{course.courseName}</p>
    {course.failedCount > 0 && (
      <p className="text-xs mb-2 font-semibold opacity-90">
        Veces reprobado: {course.failedCount}
      </p>
    )}
    <div className="flex justify-between items-center text-xs opacity-80">
      <span>Periodo: {course.latestPeriod}</span>
      <span>{course.credits} créditos</span>
    </div>
  </div>
)

export default CourseCardAvance
