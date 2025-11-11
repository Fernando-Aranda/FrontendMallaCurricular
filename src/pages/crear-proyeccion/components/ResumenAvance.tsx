import type { ProyeccionData } from "../../../types/proyeccion"

interface ResumenAvanceProps {
  proyeccionData: ProyeccionData
}

const ResumenAvance = ({ proyeccionData }: ResumenAvanceProps) => {
  const ramosAprobados = proyeccionData.avance.filter((a) => a.status === "APROBADO")
  const ramosReprobados = proyeccionData.avance.filter((a) => a.status === "REPROBADO")

  const creditosAprobados = ramosAprobados.reduce((sum, ramo) => {
    const ramoMalla = proyeccionData.malla.find((m) => m.codigo === ramo.course)
    return sum + (ramoMalla?.creditos || 0)
  }, 0)

  const creditosTotales = proyeccionData.malla.reduce((sum, r) => sum + r.creditos, 0)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Resumen de Avance</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Ramos Aprobados</p>
          <p className="text-2xl font-bold text-green-700">{ramosAprobados.length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-gray-600">Ramos Reprobados</p>
          <p className="text-2xl font-bold text-red-700">{ramosReprobados.length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Créditos Aprobados</p>
          <p className="text-2xl font-bold text-blue-700">
            {creditosAprobados} / {creditosTotales}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600">Ramos Disponibles</p>
          <p className="text-2xl font-bold text-purple-700">{proyeccionData.ramosLiberados.length}</p>
        </div>
      </div>
    </div>
  )
}

export default ResumenAvance