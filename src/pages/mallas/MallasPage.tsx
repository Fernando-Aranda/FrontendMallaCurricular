import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useMallas } from "../../hooks/useMallas"
import NavigationUcn from "../../components/NavigationUcn"
import { useMallasBySemester } from "./hooks/useMallasBySemester"
import SemesterColumn from "./components/SemesterColumn"

const MallasPage = () => {
  const { codigoCarrera } = useParams<{ codigoCarrera: string }>()
  const { mallas, loading, error } = useMallas(codigoCarrera)

  const { grouped, semesters } = useMallasBySemester(mallas)
  const totalSemesters = semesters.length || 1

  const courseMap = useMemo(() => {
    const map = new Map<string, string>()
    mallas.forEach((c) => map.set(c.codigo, c.asignatura))
    return map
  }, [mallas])

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      
      <NavigationUcn codigoCarrera={codigoCarrera} />

      <main className="flex-1 flex flex-col p-4 w-full max-w-[100vw]">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 flex-shrink-0">
          Malla Curricular
        </h2>

        <div className="flex-1 relative bg-slate-100/50 rounded-xl border border-slate-200/60 p-1">
          
          {loading ? (
             <div className="flex h-full items-center justify-center flex-col gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800"></div>
                <p className="text-gray-500">Cargando malla...</p>
             </div>
          ) : error ? (
             <div className="flex h-full items-center justify-center">
                <p className="text-red-600 font-bold">{error}</p>
             </div>
          ) : mallas.length > 0 ? (
            <div 
              className="absolute inset-2 grid gap-2 overflow-hidden"
              style={{ 
                gridTemplateColumns: `repeat(${totalSemesters}, minmax(0, 1fr))` 
              }}
            >
              {semesters.map((semester) => (
                <SemesterColumn
                  key={semester}
                  semester={semester}
                  courses={grouped[semester]}
                  courseMap={courseMap} 
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No hay cursos disponibles.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MallasPage