import CourseCard from "./CourseCard"

interface SemesterColumnProps {
  semester: number
  courses: any[]
}

const SemesterColumn = ({ semester, courses }: SemesterColumnProps) => (
  <div className="flex-shrink-0 w-[280px]">
    <div className="rounded-t-lg p-4 text-center font-bold text-white mb-2 bg-slate-800">
      Semestre {semester}
    </div>

    <div className="flex flex-col gap-3">
      {courses.map((course) => (
        <CourseCard key={course.codigo} course={course} />
      ))}
    </div>
  </div>
)

export default SemesterColumn
