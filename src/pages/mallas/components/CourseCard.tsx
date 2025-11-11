import { useState } from "react"
import PrereqTooltip from "./PrereqTooltip"
interface CourseCardProps {
  course: any
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`relative rounded-lg p-4 shadow-md transition-all duration-200 cursor-pointer text-white
        ${hovered ? "bg-blue-600" : "bg-slate-700"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <p className="font-bold text-sm mb-1">{course.codigo}</p>
        <p className="text-sm font-medium mb-2">{course.asignatura}</p>
        <div className="flex justify-between items-center text-xs text-slate-300">
          <span>Créditos: {course.creditos}</span>
        </div>
      </div>

      {hovered && course.prereq && <PrereqTooltip prereq={course.prereq} />}
    </div>
  )
}

export default CourseCard
