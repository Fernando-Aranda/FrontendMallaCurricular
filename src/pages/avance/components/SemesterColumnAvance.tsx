import CourseCardAvance from "./CourseCardAvance"

interface SemesterColumnAvanceProps {
  semester: number
  courses: any[]
}

const SemesterColumnAvance = ({ semester, courses }: SemesterColumnAvanceProps) => (
  <div className="flex flex-col gap-3 min-w-[280px]">
    <div className="p-4 rounded-t-lg text-center font-bold text-white bg-slate-800">
      Semestre {semester}
    </div>
    {courses.map((course) => (
      <CourseCardAvance key={course.courseCode} course={course} />
    ))}
  </div>
)

export default SemesterColumnAvance
