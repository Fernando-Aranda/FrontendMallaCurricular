import React from "react";
import NavigationUcn from "../../components/NavigationUcn";
import FormHeader from "./components/FormHeader";
import PeriodoList from "./components/PeriodoList";
import ProyeccionPreview from "./components/ProyeccionPreview";
import { useCrearProyeccion } from "./hooks/useCrearProyeccion";
import { useMallasFiltradas } from "../../hooks/useMallasFiltradas";

export default function CrearProyeccion() {
  const {
    rut,
    nombre,
    codigoCarrera,
    periodos,
    loading,
    error,
    data,
    setNombre,
    agregarPeriodo,
    eliminarUltimoPeriodo,
    agregarRamo,
    eliminarRamo, // 👈 Importamos
    actualizarRamo,
    handleSubmit,
    formInvalido,
    periodosHistoricos,
  } = useCrearProyeccion();

  const {
    opcionesPorPeriodo,
    loading: loadingFiltrado,
    error: errorFiltrado,
  } = useMallasFiltradas();

  const primerPeriodoHistoricoNum = (periodosHistoricos && periodosHistoricos.length > 0)
    ? parseInt(periodosHistoricos[0], 10)
    : null;

  const ramosSeleccionados = periodos
    .flatMap((p) => p.ramos)
    .map((r) => r.codigoRamo)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <NavigationUcn codigoCarrera={codigoCarrera} />

      <main className="p-4 md:p-6 w-full max-w-[1920px] mx-auto flex-1">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Crear Proyección
          </h2>
          {loadingFiltrado && <span className="text-blue-600 text-sm animate-pulse">Cargando malla...</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-full items-start">
          
          <div className="lg:col-span-7 order-2 lg:order-1">
             <ProyeccionPreview 
              periodos={periodos} 
              catalogoCompleto={opcionesPorPeriodo[0] ? opcionesPorPeriodo[0] : []} 
            />
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 sticky top-4"
            >
              <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
                Configuración
              </h3>

              <FormHeader
                rut={rut}
                nombre={nombre}
                codigoCarrera={codigoCarrera}
                setNombre={setNombre}
              />

              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <PeriodoList
                  periodos={periodos}
                  agregarPeriodo={agregarPeriodo}
                  eliminarUltimoPeriodo={eliminarUltimoPeriodo}
                  agregarRamo={agregarRamo}
                  eliminarRamo={eliminarRamo} // 👈 Pasamos función
                  actualizarRamo={actualizarRamo}
                  opcionesPorPeriodo={opcionesPorPeriodo}
                  ramosSeleccionados={ramosSeleccionados}
                  primerPeriodoHistorico={primerPeriodoHistoricoNum} 
                />
              </div>

              <div className="pt-4 border-t mt-4">
                <button
                  type="submit"
                  disabled={loading || formInvalido}
                  className={`w-full py-3 rounded-lg font-semibold transition shadow-md ${
                    loading || formInvalido
                      ? "bg-gray-400 cursor-not-allowed text-gray-100"
                      : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.02]"
                  }`}
                >
                  {loading ? "Guardando..." : "Guardar Proyección"}
                </button>
              </div>
            </form>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg text-sm">{String(error)}</div>}
            
            {data && (
              <details className="bg-white p-2 rounded shadow text-xs text-gray-500">
                <summary>Ver respuesta del servidor</summary>
                <pre className="mt-2">{JSON.stringify(data.crearProyeccion, null, 2)}</pre>
              </details>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}