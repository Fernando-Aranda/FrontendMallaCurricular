import { useMemo } from "react"

interface PrereqTooltipProps {
  prereqCodes: string
  courseMap: Map<string, string>
}

const PrereqTooltip = ({ prereqCodes, courseMap }: PrereqTooltipProps) => {
  
  // Procesamos los códigos: separamos por comas y limpiamos espacios
  const prerequisites = useMemo(() => {
    if (!prereqCodes) return []
    
    return prereqCodes.split(',').map(code => {
      const cleanCode = code.trim()
      // Buscamos el nombre, si no existe devolvemos el código original
      const name = courseMap.get(cleanCode) || cleanCode
      return { code: cleanCode, name }
    })
  }, [prereqCodes, courseMap])

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg shadow-xl p-3 w-48 md:w-56 z-50">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
          Prerrequisitos
        </span>
      </div>

      <ul className="space-y-2">
        {prerequisites.map((item, index) => (
          <li key={index} className="flex flex-col">
            {/* Nombre del Ramo */}
            <span className="text-[11px] font-semibold text-white leading-tight">
              {item.name}
            </span>
            {/* Código en pequeño (opcional, pero útil) */}
            <span className="text-[9px] text-slate-400 font-mono">
              {item.code}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PrereqTooltip