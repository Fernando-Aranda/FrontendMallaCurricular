import CourseCard from "./CourseCard"

interface SemesterColumnProps {
  semester: number
  courses: any[]
  courseMap: Map<string, string> // Nueva prop
}

const SemesterColumn = ({ semester, courses, courseMap }: SemesterColumnProps) => (
  <div className="flex flex-col h-full overflow-hidden bg-slate-200/50 rounded-lg border border-slate-300">
    <div className="py-2 text-center font-bold text-white bg-slate-800 text-xs md:text-sm uppercase tracking-wider flex-shrink-0">
      Sem {semester}
    </div>

    <div className="flex-1 overflow-y-auto p-1.5 space-y-2 scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-transparent">
      {courses.map((course) => (
        <CourseCard 
          key={course.codigo} 
          course={course} 
          courseMap={courseMap} // Lo pasamos hacia abajo
        />
      ))}
    </div>
  </div>
)

export default SemesterColumn