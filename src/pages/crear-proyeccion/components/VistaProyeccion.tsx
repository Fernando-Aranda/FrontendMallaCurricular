import type { RamoEnProyeccion } from "../hooks/useCrearProyeccion"

interface VistaProyeccionProps {
  ramosSeleccionados: RamoEnProyeccion[]
  ramosPorSemestre: Record<number, RamoEnProyeccion[]>
  maxSemestre: number
  onEliminarRamo: (codigoRamo: string) => void
  onCambiarSemestre: (codigoRamo: string, nuevoSemestre: number) => void
  readOnly?: boolean;
}

const VistaProyeccion = ({
  ramosSeleccionados,
  ramosPorSemestre,
  maxSemestre,
  onEliminarRamo,
  onCambiarSemestre,
  readOnly = false,
}: VistaProyeccionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Proyección por Semestre</h2>
      {ramosSeleccionados.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Agrega ramos desde el panel izquierdo para comenzar tu proyección
        </p>
      ) : (
        <div className="space-y-4">
          {Array.from({ length: maxSemestre }, (_, i) => i + 1).map((semestre) => {
            const ramosSemestre = ramosPorSemestre[semestre] || []
            const creditosSemestre = ramosSemestre.reduce((sum, r) => sum + r.creditos, 0)

            return (
              <div key={semestre} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">Semestre {semestre}</h3>
                  <span className="text-sm text-gray-600">{creditosSemestre} créditos</span>
                </div>
                {ramosSemestre.length === 0 ? (
                  <p className="text-gray-400 text-sm">Sin ramos asignados</p>
                ) : (
                  <div className="space-y-2">
                    {ramosSemestre.map((ramo) => (
                      <div key={ramo.codigoRamo} className="bg-blue-50 p-3 rounded border border-blue-200">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{ramo.codigoRamo}</p>
                            <p className="text-xs text-gray-600">{ramo.asignatura}</p>
                            <p className="text-xs text-gray-500">{ramo.creditos} créditos</p>
                          </div>
                          {!readOnly && (
                            <button
                              onClick={() => onEliminarRamo(ramo.codigoRamo)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600">Mover a semestre:</label>
                          {readOnly ? (<span ClassName="text-sm font-bold text-gray 700">{ramo.semestre}</span>) : (
                            <input
                            type="number"
                            min="1"
                            value={ramo.semestre}
                            onChange={(e) => onCambiarSemestre(ramo.codigoRamo, Number(e.target.value))}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default VistaProyeccion