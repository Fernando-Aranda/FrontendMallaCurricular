interface ConfiguracionProyeccionProps {
  nombreProyeccion: string
  onNombreChange: (value: string) => void
  semestreActual: number
  onSemestreChange: (value: number) => void
}

const ConfiguracionProyeccion = ({
  nombreProyeccion,
  onNombreChange,
  semestreActual,
  onSemestreChange,
}: ConfiguracionProyeccionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Configuración de Proyección</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Proyección</label>
        <input
          type="text"
          value={nombreProyeccion}
          onChange={(e) => onNombreChange(e.target.value)}
          placeholder="Ej: Proyección Semestre 2025-1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Semestre para agregar ramos</label>
        <input
          type="number"
          min="1"
          value={semestreActual}
          onChange={(e) => onSemestreChange(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}

export default ConfiguracionProyeccion