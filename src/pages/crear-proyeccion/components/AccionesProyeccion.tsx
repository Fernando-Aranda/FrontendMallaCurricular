interface AccionesProyeccionProps {
  onGuardar: () => void
  onCancelar: () => void
  guardando: boolean
  puedeGuardar: boolean
}

const AccionesProyeccion = ({ onGuardar, onCancelar, guardando, puedeGuardar }: AccionesProyeccionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex gap-4">
        <button
          onClick={onGuardar}
          disabled={guardando || !puedeGuardar}
          className={`flex-1 py-3 rounded-lg font-semibold ${
            guardando || !puedeGuardar
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {guardando ? "Guardando..." : "Guardar Proyección"}
        </button>
        <button
          onClick={onCancelar}
          className="flex-1 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
export default AccionesProyeccion