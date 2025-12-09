import { useEffect } from "react"
import ProgressCircle from "./ProgressCircle"


const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)

interface SidebarAvanceProps {
  isOpen: boolean          
  onClose: () => void  
  filter: string
  setFilter: (f: string) => void
  progressPercentage: number
  creditosAprobados: number
  totalCreditos: number
  aprobados: number
  reprobados: number
  pendientes?: number
}

const SidebarAvance = ({
  isOpen,
  onClose,
  filter,
  setFilter,
  progressPercentage,
  creditosAprobados,
  totalCreditos,
  aprobados,
  reprobados,
  pendientes = 0,
}: SidebarAvanceProps) => {
  
 
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  return (
    <>

      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 backdrop-blur-sm ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />


      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >

        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-slate-800">Resumen y Filtros</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <CloseIcon />
          </button>
        </div>


        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-8">
          
          <div className="text-center">
             <div className="flex justify-center mb-4">
              <ProgressCircle percentage={progressPercentage} size={140} />
            </div>
            <p className="text-sm text-gray-500 font-semibold uppercase">Avance Total</p>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-green-50">
              <span className="block text-2xl font-bold text-green-700">{aprobados}</span>
              <span className="text-[10px] uppercase font-bold text-green-600">Apr.</span>
            </div>
            <div className="p-2 rounded bg-red-50">
              <span className="block text-2xl font-bold text-red-700">{reprobados}</span>
              <span className="text-[10px] uppercase font-bold text-red-600">Repr.</span>
            </div>
            <div className="p-2 rounded bg-blue-50">
              <span className="block text-2xl font-bold text-blue-700">{pendientes}</span>
              <span className="text-[10px] uppercase font-bold text-blue-600">Pend.</span>
            </div>
          </div>
           
           <div className="bg-slate-50 p-4 rounded-lg text-center border border-slate-100">
             <p className="text-xs text-gray-400 font-bold uppercase mb-1">Créditos</p>
             <p className="text-xl font-bold text-slate-700">{creditosAprobados} / {totalCreditos}</p>
           </div>

          <hr className="border-gray-100" />

          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Filtrar Asignaturas</h3>
            <div className="space-y-2">
              {[
                { id: "TODOS", label: "Todas las Asignaturas", color: "bg-slate-700" },
                { id: "APROBADO", label: "Aprobadas", color: "bg-green-600" },
                { id: "INSCRITO", label: "En Curso Actual", color: "bg-blue-600" },
                { id: "PENDIENTE", label: "Pendientes", color: "bg-gray-400" },
                { id: "REPROBADO", label: "Con Reprobaciones", color: "bg-red-500" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                     setFilter(opt.id)

                  }}
                  className={`w-full p-3 rounded-lg text-sm font-bold text-white transition-all flex justify-between items-center ${
                    filter === opt.id ? opt.color + " ring-2 ring-offset-2 ring-slate-300" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {opt.label}
                  {filter === opt.id && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SidebarAvance