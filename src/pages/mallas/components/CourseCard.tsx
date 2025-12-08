import { useState } from "react"
import PrereqTooltip from "./PrereqTooltip"

interface CourseCardProps {
  course: any
  courseMap: Map<string, string> // Nueva prop
}

const CourseCard = ({ course, courseMap }: CourseCardProps) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`relative rounded-md p-2 shadow-sm transition-all duration-200 cursor-default
        ${hovered ? "bg-blue-600 ring-2 ring-blue-400 z-10" : "bg-slate-700 hover:bg-slate-600"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="text-white">
        <div className="flex justify-between items-start mb-1">
           <p className="font-bold text-[9px] uppercase opacity-70 tracking-wider">
             {course.codigo}
           </p>
           {course.prereq && (
             <span className="text-[8px] bg-white/20 px-1 rounded text-white/80">
               Req
             </span>
           )}
        </div>

        <p className="text-[10px] md:text-xs font-bold leading-tight mb-2 break-words">
          {course.asignatura}
        </p>

        <div className="border-t border-white/10 pt-1 mt-1">
          <p className="text-[9px] font-medium text-slate-300 text-right">
            {course.creditos} Créditos
          </p>
        </div>
      </div>

      {/* Pasamos el prereq string Y el mapa */}
      {hovered && course.prereq && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50">
           <PrereqTooltip prereqCodes={course.prereq} courseMap={courseMap} />
        </div>
      )}
    </div>
  )
}

export default CourseCard