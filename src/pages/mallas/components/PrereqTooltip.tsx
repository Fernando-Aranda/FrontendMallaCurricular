interface PrereqTooltipProps {
  prereq: string
}

const PrereqTooltip = ({ prereq }: PrereqTooltipProps) => (
  <div className="absolute left-0 right-0 top-full mt-2 z-10 p-3 rounded-lg shadow-xl bg-slate-600 border-2 border-blue-500">
    <p className="text-xs font-semibold mb-1 text-slate-200">Prerrequisitos:</p>
    <p className="text-xs text-white whitespace-pre-wrap">{prereq}</p>
  </div>
)

export default PrereqTooltip
