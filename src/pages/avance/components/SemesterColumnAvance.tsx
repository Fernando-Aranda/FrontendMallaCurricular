import CourseCardAvance from "./CourseCardAvance"

interface SemesterColumnAvanceProps {
  semester: number
  courses: any[]
}

const SemesterColumnAvance = ({ semester, courses }: SemesterColumnAvanceProps) => (
  <div className="flex flex-col h-full overflow-hidden bg-slate-100/50 rounded-lg border border-slate-200">
    <div className="py-2 text-center font-bold text-white bg-slate-700 text-xs md:text-sm uppercase tracking-wider">
      Sem {semester}
    </div>
    <div className="flex-1 overflow-y-auto p-1.5 space-y-2 scrollbar-thin scrollbar-thumb-slate-300">
      {courses.map((course) => (
        <CourseCardAvance key={course.courseCode} course={course} />
      ))}
    </div>
  </div>
)

export default SemesterColumnAvance