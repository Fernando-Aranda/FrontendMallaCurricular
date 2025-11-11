import type { RamoMalla, RamoEnProyeccion } from "../hooks/useCrearProyeccion"

interface ListaRamosDisponiblesProps {
  ramosLiberados: RamoMalla[]
  ramosSeleccionados: RamoEnProyeccion[]
  semestreActual: number
  verificarPrerequisitos: (codigoRamo: string, semestreDestino: number) => { valido: boolean; mensaje: string }
  onAgregarRamo: (codigoRamo: string) => void
}

const ListaRamosDisponibles = ({
  ramosLiberados,
  ramosSeleccionados,
  semestreActual,
  verificarPrerequisitos,
  onAgregarRamo,
}: ListaRamosDisponiblesProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Ramos Disponibles para Cursar</h2>
      <p className="text-sm text-gray-600 mb-4">Estos ramos tienen sus prerrequisitos cumplidos</p>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {ramosLiberados.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay ramos disponibles en este momento</p>
        ) : (
          ramosLiberados.map((ramo) => {
            const yaAgregado = ramosSeleccionados.some((r) => r.codigoRamo === ramo.codigo)
            const validacion = verificarPrerequisitos(ramo.codigo, semestreActual)
            const puedeAgregar = !yaAgregado && validacion.valido

            return (
              <div
                key={ramo.codigo}
                className={`p-3 border rounded-lg ${
                  yaAgregado
                    ? "bg-gray-100 border-gray-300"
                    : puedeAgregar
                      ? "bg-white border-gray-200 hover:border-blue-400"
                      : "bg-yellow-50 border-yellow-300"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{ramo.codigo}</p>
                    <p className="text-xs text-gray-600">{ramo.asignatura}</p>
                    <p className="text-xs text-gray-500">
                      {ramo.creditos} créditos • Nivel {ramo.nivel}
                    </p>
                    {!yaAgregado && !validacion.valido && (
                      <p className="text-xs text-yellow-700 mt-1">⚠️ {validacion.mensaje}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onAgregarRamo(ramo.codigo)}
                    disabled={yaAgregado || !puedeAgregar}
                    className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap ${
                      yaAgregado
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : puedeAgregar
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-yellow-300 text-yellow-800 cursor-not-allowed"
                    }`}
                  >
                    {yaAgregado ? "Agregado" : puedeAgregar ? "Agregar" : "Bloqueado"}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ListaRamosDisponibles